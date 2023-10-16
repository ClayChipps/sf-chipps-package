/*
 * Copyright (c) 2023, Clay Chipps
 * All rights reserved.
 * Licensed under the MIT License.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/MIT
 */

import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { AuthInfo, Connection, Messages, Logger } from '@salesforce/core';
import {
  Package,
  PackageSaveResult,
  PackageVersion,
  PackageVersionListOptions,
  PackageVersionOptions,
} from '@salesforce/packaging';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sf-chipps-package', 'chipps.package.version.cleanup');

export type ChippsPackageVersionCleanupResult = {
  Error?: string;
  Success: boolean;
  SubscriberPackageVersionId: string;
};

export default class ChippsPackageVersionCleanup extends SfCommand<ChippsPackageVersionCleanupResult[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    matcher: Flags.string({
      summary: messages.getMessage('flags.matcher.summary'),
      description: messages.getMessage('flags.matcher.description'),
      char: 's',
      required: true,
    }),
    package: Flags.string({
      summary: messages.getMessage('flags.package.summary'),
      description: messages.getMessage('flags.package.description'),
      char: 'p',
      required: true,
    }),
    'target-dev-hub': Flags.string({
      summary: messages.getMessage('flags.target-dev-hub.summary'),
      char: 'n',
      required: true,
    }),
  };

  public async run(): Promise<ChippsPackageVersionCleanupResult[]> {
    const log = await Logger.child(this.ctor.name);

    const { flags } = await this.parse(ChippsPackageVersionCleanup);

    // Initialize the authorization for the target dev hub
    const targetDevHubAuthInfo = await AuthInfo.create({ username: flags['target-dev-hub'] });

    // Create a connection to the org
    const connection = await Connection.create({ authInfo: targetDevHubAuthInfo });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const project = this.project;

    const matcher = flags.matcher;

    const matcherRegex = new RegExp(/^\d+\.\d+\.\d+$/);
    const matcherValid = matcherRegex.test(matcher);

    if (!matcherValid) {
      throw messages.createError('errors.matcherFormatMismatch');
    }

    const matcherSplit = matcher.split('.');
    const majorMatcher = matcherSplit.at(0);
    const minorMatcher = matcherSplit.at(1);
    const patchMatcher = matcherSplit.at(2);

    log.info(`Major Matcher ${majorMatcher} Minor Matcher ${minorMatcher} Patch Matcher ${patchMatcher}`);

    const packageVersionListOptions: PackageVersionListOptions = {
      concise: false,
      createdLastDays: undefined as unknown as number,
      modifiedLastDays: undefined as unknown as number,
      orderBy: 'MajorVersion, MinorVersion, PatchVersion, BuildNumber',
      packages: [flags.package],
      isReleased: false,
      verbose: true,
    };

    const packageVersions = await Package.listVersions(connection, project, packageVersionListOptions);

    const targetVersions = packageVersions.filter(
      (packageVersion) =>
        packageVersion.IsReleased === false &&
        packageVersion.MajorVersion.toString() === majorMatcher &&
        packageVersion.MinorVersion.toString() === minorMatcher &&
        packageVersion.PatchVersion.toString() === patchMatcher
    );

    const packageVersionDeletePromiseRequests: Array<Promise<PackageSaveResult>> = [];

    targetVersions.forEach((targetVersion) => {
      const packageVersionOptions: PackageVersionOptions = {
        connection,
        project,
        idOrAlias: targetVersion.SubscriberPackageVersionId,
      };

      packageVersionDeletePromiseRequests.push(new PackageVersion(packageVersionOptions).delete());
    });

    const results: ChippsPackageVersionCleanupResult[] = [];

    const promiseResults = await Promise.allSettled(packageVersionDeletePromiseRequests);

    promiseResults.forEach((promiseResult, index) => {
      switch (promiseResult.status) {
        case 'fulfilled':
          results.push({
            Success: promiseResult?.value?.success,
            SubscriberPackageVersionId: targetVersions[index].SubscriberPackageVersionId,
          });
          break;
        case 'rejected':
          results.push({
            Success: false,
            Error: promiseResult.reason as string,
            SubscriberPackageVersionId: targetVersions[index].SubscriberPackageVersionId,
          });
          break;
      }
    });

    this.displayDeletionResults(results);

    return results;
  }

  private displayDeletionResults(packageCleanupResults: ChippsPackageVersionCleanupResult[]): void {
    this.styledHeader('Package Version Cleanup Results');
    this.table(packageCleanupResults, {
      SubscriberPackageVersionId: { header: 'PACKAGE VERSION ID' },
      Success: { header: 'SUCCESS' },
      Error: { header: 'ERROR' },
    });
  }
}
