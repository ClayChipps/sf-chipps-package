/*
 * Copyright (c) 2023, Clay Chipps
 * All rights reserved.
 * Licensed under the MIT License.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/MIT
 */

/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unsafe-finally */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { AuthInfo, Connection, Messages, Lifecycle, PackageDirDependency, SfError } from '@salesforce/core';
import { Duration } from '@salesforce/kit';
import {
  InstalledPackages,
  PackageEvents,
  PackageInstallCreateRequest,
  PackageInstallOptions,
  SubscriberPackageVersion,
  PackagingSObjects,
} from '@salesforce/packaging';
import { Optional } from '@salesforce/ts-types';
import {
  isPackageVersionId,
  isPackageVersionInstalled,
  reducePackageInstallRequestErrors,
  resolvePackageVersionId,
} from '../../../../common/packageUtils.js';

type PackageInstallRequest = PackagingSObjects.PackageInstallRequest;

Messages.importMessagesDirectory(dirname(fileURLToPath(import.meta.url)));
const messages = Messages.loadMessages('sf-chipps-package', 'chipps.package.dependencies.install');

export type PackageToInstall = {
  PackageName: string;
  SubscriberPackageVersionId: string;
};

const installType = { All: 'all', Delta: 'delta' };
const securityType = { AllUsers: 'full', AdminsOnly: 'none' };
const upgradeType = { Delete: 'delete-only', DeprecateOnly: 'deprecate-only', Mixed: 'mixed-mode' };

const installationKeyRegex = new RegExp(/^(\w+:\w+)(,\s*\w+:\w+)*/);

export default class PackageDependenciesInstall extends SfCommand<PackageInstallRequest[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'apex-compile': Flags.custom<PackageInstallCreateRequest['ApexCompileType']>({
      options: ['all', 'package'],
    })({
      summary: messages.getMessage('flags.apex-compile.summary'),
      description: messages.getMessage('flags.apex-compile.description'),
      char: 'a',
    }),
    branch: Flags.string({
      summary: messages.getMessage('flags.branch.summary'),
      description: messages.getMessage('flags.branch.description'),
      char: 'z',
      default: '',
    }),
    'install-type': Flags.custom<'All' | 'Delta'>({
      options: ['All', 'Delta'],
    })({
      char: 'i',
      summary: messages.getMessage('flags.install-type.summary'),
      description: messages.getMessage('flags.install-type.description'),
      default: 'Delta',
    }),
    'installation-key': Flags.string({
      summary: messages.getMessage('flags.installation-key.summary'),
      description: messages.getMessage('flags.installation-key.description'),
      char: 'k',
      multiple: true,
    }),
    'no-prompt': Flags.boolean({
      summary: messages.getMessage('flags.no-prompt.summary'),
      description: messages.getMessage('flags.no-prompt.description'),
      char: 'r',
      default: false,
      required: false,
    }),
    'publish-wait': Flags.duration({
      unit: 'minutes',
      summary: messages.getMessage('flags.publish-wait.summary'),
      char: 'b',
      default: Duration.minutes(0),
    }),
    'security-type': Flags.custom<'AllUsers' | 'AdminsOnly'>({
      options: ['AllUsers', 'AdminsOnly'],
    })({
      char: 's',
      summary: messages.getMessage('flags.security-type.summary'),
      default: 'AdminsOnly',
    }),
    'skip-handlers': Flags.string({
      multiple: true,
      options: ['FeatureEnforcement'],
      char: 'l',
      summary: messages.getMessage('flags.skip-handlers.summary'),
      description: messages.getMessage('flags.skip-handlers.description'),
      hidden: true,
    }),
    'target-dev-hub': Flags.string({
      summary: messages.getMessage('flags.target-dev-hub.summary'),
      char: 'v',
    }),
    'target-org': Flags.string({
      summary: messages.getMessage('flags.target-org.summary'),
      char: 'n',
      required: true,
    }),
    'upgrade-type': Flags.custom<'DeprecateOnly' | 'Mixed' | 'Delete'>({
      options: ['DeprecateOnly', 'Mixed', 'Delete'],
    })({
      char: 't',
      summary: messages.getMessage('flags.upgrade-type.summary'),
      description: messages.getMessage('flags.upgrade-type.description'),
      default: 'Mixed',
    }),
    wait: Flags.duration({
      unit: 'minutes',
      char: 'w',
      summary: messages.getMessage('flags.wait.summary'),
      default: Duration.minutes(0),
    }),
  };

  private subscriberPackageVersion!: SubscriberPackageVersion;

  public async run(): Promise<PackageInstallRequest[]> {
    const { flags } = await this.parse(PackageDependenciesInstall);

    // Authorize to the target org
    const targetOrgAuthInfo = await AuthInfo.create({ username: flags['target-org'] });
    const targetOrgConnection = await Connection.create({ authInfo: targetOrgAuthInfo });

    // Validate minimum api version
    const apiVersion = parseInt(targetOrgConnection.getApiVersion(), 10);
    if (apiVersion < 36) {
      throw messages.createError('error.apiVersionTooLow');
    }

    // Introspect the project to find dependencies
    const project = this.project;

    let packagesToInstall: PackageToInstall[] = [];
    const packageInstallRequests: PackageInstallRequest[] = [];
    const dependenciesForDevHubResolution: PackageDirDependency[] = [];

    let packageAliases;
    if (await project.hasPackageAliases()) {
      packageAliases = project.getPackageAliases();
    }
    const packageDirectories = project.getPackageDirectories();

    this.spinner.start('Analyzing project to determine packages to install...');

    for (const packageDirectory of packageDirectories) {
      const dependencies = packageDirectory?.dependencies ?? [];

      for (const dependency of dependencies) {
        const pakage = dependency.package; // 'package' is a restricted word in safe mode
        const versionNumber = dependency.versionNumber;

        if (pakage && versionNumber) {
          // This must be resolved by a dev hub
          dependenciesForDevHubResolution.push(dependency);
          continue;
        }

        // Assume the package is not an alias
        let packageVersionId = pakage;

        // If we found the alias, then use that value as the packageVersionId
        if (packageAliases?.[packageVersionId]) {
          packageVersionId = packageAliases?.[packageVersionId] as string;
        }

        if (!isPackageVersionId(packageVersionId)) {
          throw messages.createError('error.noSubscriberPackageVersionId');
        }

        packagesToInstall.push({
          PackageName: pakage,
          SubscriberPackageVersionId: packageVersionId,
        } as PackageToInstall);
      }
    }

    if (dependenciesForDevHubResolution.length > 0) {
      this.spinner.start('Resolving package versions from dev hub...');

      // Initialize the authorization for the provided dev hub
      const targetDevHubAuthInfo = await AuthInfo.create({ username: flags['target-dev-hub'] });

      // Create a connection to the dev hub
      const devHubConnection = await Connection.create({ authInfo: targetDevHubAuthInfo });

      if (!devHubConnection) {
        throw messages.createError('error.devHubMissing');
      }

      for (const dependencyForDevHubResolution of dependenciesForDevHubResolution) {
        const pakage = dependencyForDevHubResolution.package; // 'package' is a restricted word in safe mode
        const versionNumber = dependencyForDevHubResolution.versionNumber;

        if (!pakage || !versionNumber) {
          continue;
        }

        // Assume the package is not an alias
        let packageVersionId = pakage;

        // If we found the alias, then use that value as the packageVersionId
        if (packageAliases?.[packageVersionId]) {
          packageVersionId = packageAliases?.[packageVersionId] as string;
        }

        packageVersionId = await resolvePackageVersionId(pakage, versionNumber, flags.branch, devHubConnection);
      }
    }

    // Filter out duplicate packages before we start the install process
    this.spinner.start('Checking for duplicate package dependencies...');
    packagesToInstall = packagesToInstall.filter(
      (packageToInstall, index, self) =>
        index === self.findIndex((t) => t.SubscriberPackageVersionId === packageToInstall?.SubscriberPackageVersionId)
    );

    // If we have packages, begin the install process
    if (packagesToInstall?.length > 0) {
      let installedPackages: InstalledPackages[] = [];

      // If precheck is enabled, get the currently installed packages
      if (installType[flags['install-type']] === installType.Delta) {
        this.spinner.start('Analyzing which packages to install...');
        installedPackages = await SubscriberPackageVersion.installedList(targetOrgConnection);
      }

      // Process any installation keys for the packages
      const installationKeyMap = new Map<string, string>();

      if (flags['installation-key']) {
        this.spinner.start('Processing package installation keys...');
        for (let installationKey of flags['installation-key']) {
          installationKey = installationKey.trim();

          const isKeyValid = installationKeyRegex.test(installationKey);

          if (!isKeyValid) {
            throw messages.createError('error.installationKeyFormat');
          }

          const installationKeyPair = installationKey.split(':');
          let packageId = installationKeyPair[0];
          const packageKey = installationKeyPair[1];

          // Check if the key is an alias
          if (packageAliases?.[packageId]) {
            // If it is, get the id for the package
            packageId = packageAliases?.[packageId] as string;
          }

          installationKeyMap.set(packageId, packageKey);
        }
      }

      this.spinner.start('Installing packages...');

      for (const packageToInstall of packagesToInstall) {
        let installationKey = '';

        if (installType[flags['install-type']] === installType.Delta) {
          if (isPackageVersionInstalled(installedPackages, packageToInstall?.SubscriberPackageVersionId)) {
            const packageName = packageToInstall?.PackageName;
            const versionNumber = packageToInstall?.SubscriberPackageVersionId;

            this.spinner.start(
              `Package ${packageName} v${versionNumber} is already present in the org and will be ignored`
            );

            continue;
          }
        }

        // Check if we have an installation key for this package
        if (installationKeyMap.has(packageToInstall?.SubscriberPackageVersionId)) {
          // If we do, set the installation key value
          installationKey = installationKeyMap.get(packageToInstall?.SubscriberPackageVersionId) ?? '';
        }

        this.spinner.start(`Installing package ${packageToInstall.PackageName}...`);

        this.subscriberPackageVersion = new SubscriberPackageVersion({
          connection: targetOrgConnection,
          aliasOrId: packageToInstall?.SubscriberPackageVersionId,
          password: installationKey,
        });

        const request: PackageInstallCreateRequest = {
          SubscriberPackageVersionKey: await this.subscriberPackageVersion.getId(),
          Password: installationKey,
          ApexCompileType: flags['apex-compile'],
          SecurityType: securityType[flags['security-type']] as PackageInstallCreateRequest['SecurityType'],
          SkipHandlers: flags['skip-handlers']?.join(','),
          UpgradeType: upgradeType[flags['upgrade-type']] as PackageInstallCreateRequest['UpgradeType'],
        };

        // eslint-disable-next-line @typescript-eslint/require-await
        Lifecycle.getInstance().on(PackageEvents.install.warning, async (warningMsg: string) => {
          this.warn(warningMsg);
        });

        if (flags['publish-wait']?.milliseconds > 0) {
          let timeThen = Date.now();
          // waiting for publish to finish
          let remainingTime = flags['publish-wait'];

          Lifecycle.getInstance().on(
            PackageEvents.install['subscriber-status'],
            // eslint-disable-next-line @typescript-eslint/require-await
            async (publishStatus: PackagingSObjects.InstallValidationStatus) => {
              const elapsedTime = Duration.milliseconds(Date.now() - timeThen);
              timeThen = Date.now();
              remainingTime = Duration.milliseconds(remainingTime.milliseconds - elapsedTime.milliseconds);
              const status =
                publishStatus === 'NO_ERRORS_DETECTED'
                  ? messages.getMessage('info.availableForInstallation')
                  : messages.getMessage('info.unavailableForInstallation');
              this.spinner.status = messages.getMessage('info.packagePublishWaitingStatus', [
                remainingTime.minutes,
                status,
              ]);
            }
          );

          this.spinner.start(
            messages.getMessage('info.packagePublishWaitingStatus', [remainingTime.minutes, 'Querying Status'])
          );

          await this.subscriberPackageVersion.waitForPublish({
            publishTimeout: flags['publish-wait'],
            publishFrequency: Duration.seconds(10),
            installationKey,
          });

          // need to stop the spinner to avoid weird behavior with the prompts below
          this.spinner.stop();
        }

        // If the user has specified --upgradetype Delete, then prompt for confirmation
        // unless the noprompt option has been included.
        if (flags['upgrade-type'] === 'Delete') {
          if ((await this.subscriberPackageVersion.getPackageType()) === 'Unlocked' && !flags['no-prompt']) {
            const promptMsg = messages.getMessage('prompt.upgradeType');
            if (!(await this.confirm(promptMsg))) {
              throw messages.createError('info.canceledPackageInstall');
            }
          }
        }

        // If the package has external sites, ask the user for permission to enable them
        // unless the noprompt option has been included.
        const extSites = await this.subscriberPackageVersion.getExternalSites();
        if (extSites) {
          let enableRss = true;
          if (!flags['no-prompt']) {
            const promptMsg = messages.getMessage('prompt.enableRss', [extSites.join('\n')]);
            enableRss = await this.confirm(promptMsg);
          }
          if (enableRss) {
            request.EnableRss = enableRss;
          }
        }

        let installOptions: Optional<PackageInstallOptions>;
        if (flags.wait) {
          installOptions = {
            pollingTimeout: flags.wait,
            pollingFrequency: Duration.seconds(2),
          };
          let remainingTime = flags.wait;
          let timeThen = Date.now();
          this.spinner.start(messages.getMessage('info.packageInstallWaiting', [remainingTime.minutes]));

          // waiting for package install to finish
          Lifecycle.getInstance().on(
            PackageEvents.install.status,
            // eslint-disable-next-line @typescript-eslint/require-await
            async (piRequest: PackageInstallRequest) => {
              const elapsedTime = Duration.milliseconds(Date.now() - timeThen);
              timeThen = Date.now();
              remainingTime = Duration.milliseconds(remainingTime.milliseconds - elapsedTime.milliseconds);
              this.spinner.status = messages.getMessage('info.packageInstallWaitingStatus', [
                remainingTime.minutes,
                piRequest.Status,
              ]);
            }
          );
        }

        let pkgInstallRequest: Optional<PackageInstallRequest>;
        try {
          pkgInstallRequest = await this.subscriberPackageVersion.install(request, installOptions);
          this.spinner.stop();
        } catch (error: unknown) {
          if (error instanceof SfError && error.data) {
            pkgInstallRequest = error.data as PackageInstallRequest;
            this.spinner.stop(messages.getMessage('error.packageInstallPollingTimeout'));
          } else {
            throw error;
          }
        } finally {
          if (pkgInstallRequest) {
            if (pkgInstallRequest.Status === 'SUCCESS') {
              packageInstallRequests.push(pkgInstallRequest);
              this.log(messages.getMessage('info.packageInstallSuccess', [packageToInstall.PackageName]));
            } else if (['IN_PROGRESS', 'UNKNOWN'].includes(pkgInstallRequest.Status)) {
              this.log(
                messages.getMessage('info.packageInstallInProgress', [
                  this.config.bin,
                  pkgInstallRequest.Id,
                  targetOrgConnection.getUsername() as string,
                ])
              );
            } else {
              throw messages.createError('error.packageInstall', [
                reducePackageInstallRequestErrors(pkgInstallRequest),
              ]);
            }
          }
        }
      }
    } else {
      this.spinner.stop('No packages were found to install');
    }

    return packageInstallRequests;
  }
}
