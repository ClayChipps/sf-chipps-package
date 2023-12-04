/*
 * Copyright (c) 2023, Clay Chipps
 * All rights reserved.
 * Licensed under the MIT License.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/MIT
 */

import { MockTestOrgData, TestContext } from '@salesforce/core/lib/testSetup';
import { Package, PackageSaveResult, PackageVersion, PackageVersionListResult } from '@salesforce/packaging';
import { expect } from 'chai';
import PackageVersionCleanup from '../../../../../src/commands/chipps/package/version/cleanup';

const myPackage0Hot = '0Hot0000000YzlxBAB';
const packageVersion0101SubscriberId = '04t6A000002zgKSQAW';
const packageVersion0102SubscriberId = '04t6A000002zgKSQAX';
const packageVersion0201SubscriberId = '04t6A000002zgKSQAY';
const packageVersion0202SubscriberId = '04t6A000002zgKSQAZ';

const packageVersion0101ListResult: PackageVersionListResult = {
  Id: '',
  Package2Id: '',
  SubscriberPackageVersionId: packageVersion0101SubscriberId,
  Name: '',
  // @ts-ignore
  Package2: undefined,
  Description: '',
  Tag: '',
  Branch: '',
  MajorVersion: '0',
  MinorVersion: '1',
  PatchVersion: '0',
  BuildNumber: '1',
  IsReleased: false,
  CreatedDate: '1900-01-01',
  LastModifiedDate: '1900-01-01',
  IsPasswordProtected: false,
  AncestorId: '',
  ValidationSkipped: false,
  CreatedById: '',
  // @ts-ignore
  CodeCoverage: undefined,
  HasPassedCodeCoverageCheck: true,
  ConvertedFromVersionId: '',
  ReleaseVersion: '',
  BuildDurationInSeconds: 60,
  HasMetadataRemoved: false,
  Language: '',
};

const packageVersion0102ListResult: PackageVersionListResult = {
  Id: '',
  Package2Id: '',
  SubscriberPackageVersionId: packageVersion0102SubscriberId,
  Name: '',
  // @ts-ignore
  Package2: undefined,
  Description: '',
  Tag: '',
  Branch: '',
  MajorVersion: '0',
  MinorVersion: '1',
  PatchVersion: '0',
  BuildNumber: '2',
  IsReleased: true,
  CreatedDate: '1900-01-01',
  LastModifiedDate: '1900-01-01',
  IsPasswordProtected: false,
  AncestorId: '',
  ValidationSkipped: false,
  CreatedById: '',
  // @ts-ignore
  CodeCoverage: undefined,
  HasPassedCodeCoverageCheck: true,
  ConvertedFromVersionId: '',
  ReleaseVersion: '',
  BuildDurationInSeconds: 60,
  HasMetadataRemoved: false,
  Language: '',
};

const packageVersion0201ListResult: PackageVersionListResult = {
  Id: '',
  Package2Id: '',
  SubscriberPackageVersionId: packageVersion0201SubscriberId,
  Name: '',
  // @ts-ignore
  Package2: undefined,
  Description: '',
  Tag: '',
  Branch: '',
  MajorVersion: '0',
  MinorVersion: '2',
  PatchVersion: '0',
  BuildNumber: '1',
  IsReleased: false,
  CreatedDate: '1900-01-01',
  LastModifiedDate: '1900-01-01',
  IsPasswordProtected: false,
  AncestorId: '',
  ValidationSkipped: false,
  CreatedById: '',
  // @ts-ignore
  CodeCoverage: undefined,
  HasPassedCodeCoverageCheck: true,
  ConvertedFromVersionId: '',
  ReleaseVersion: '',
  BuildDurationInSeconds: 60,
  HasMetadataRemoved: false,
  Language: '',
};

const packageVersion0202ListResult: PackageVersionListResult = {
  Id: '',
  Package2Id: '',
  SubscriberPackageVersionId: packageVersion0202SubscriberId,
  Name: '',
  // @ts-ignore
  Package2: undefined,
  Description: '',
  Tag: '',
  Branch: '',
  MajorVersion: '0',
  MinorVersion: '2',
  PatchVersion: '0',
  BuildNumber: '2',
  IsReleased: true,
  CreatedDate: '1900-01-01',
  LastModifiedDate: '1900-01-01',
  IsPasswordProtected: false,
  AncestorId: '',
  ValidationSkipped: false,
  CreatedById: '',
  // @ts-ignore
  CodeCoverage: undefined,
  HasPassedCodeCoverageCheck: true,
  ConvertedFromVersionId: '',
  ReleaseVersion: '',
  BuildDurationInSeconds: 60,
  HasMetadataRemoved: false,
  Language: '',
};

/*
const packageVersion0101SubscriberPackageVersion: PackagingSObjects.SubscriberPackageVersion = {
  AppExchangeDescription: '',
  AppExchangeLogoUrl: '',
  AppExchangePackageName: '',
  AppExchangePublisherName: '',
  BuildNumber: 1,
  // @ts-ignore
  CspTrustedSites: undefined,
  // @ts-ignore
  Dependencies: undefined,
  Description: '',
  Id: packageVersion0101SubscriberId,
  InstallValidationStatus: 'NO_ERRORS_DETECTED',
  IsBeta: true,
  IsDeprecated: false,
  IsManaged: false,
  IsOrgDependent: false,
  IsPasswordProtected: false,
  IsSecurityReviewed: false,
  MajorVersion: 0,
  MinorVersion: 1,
  Name: '',
  // @ts-ignore
  Package2ContainerOptions: undefined,
  PatchVersion: 0,
  PostInstallUrl: '',
  // @ts-ignore
  Profiles: undefined,
  PublisherName: '',
  ReleaseNotesUrl: '',
  ReleaseState: '',
  // @ts-ignore
  RemoteSiteSettings: undefined,
  SubscriberPackageId: '',
};

const subscriberPackageVersion0102: PackagingSObjects.SubscriberPackageVersion = {
  AppExchangeDescription: '',
  AppExchangeLogoUrl: '',
  AppExchangePackageName: '',
  AppExchangePublisherName: '',
  BuildNumber: 2,
  // @ts-ignore
  CspTrustedSites: undefined,
  // @ts-ignore
  Dependencies: undefined,
  Description: '',
  Id: packageVersion0102SubscriberId,
  InstallValidationStatus: 'NO_ERRORS_DETECTED',
  IsBeta: false,
  IsDeprecated: false,
  IsManaged: false,
  IsOrgDependent: false,
  IsPasswordProtected: false,
  IsSecurityReviewed: false,
  MajorVersion: 0,
  MinorVersion: 1,
  Name: '',
  // @ts-ignore
  Package2ContainerOptions: undefined,
  PatchVersion: 0,
  PostInstallUrl: '',
  // @ts-ignore
  Profiles: undefined,
  PublisherName: '',
  ReleaseNotesUrl: '',
  ReleaseState: '',
  // @ts-ignore
  RemoteSiteSettings: undefined,
  SubscriberPackageId: '',
};

const subscriberPackageVersion0201: PackagingSObjects.SubscriberPackageVersion = {
  AppExchangeDescription: '',
  AppExchangeLogoUrl: '',
  AppExchangePackageName: '',
  AppExchangePublisherName: '',
  BuildNumber: 1,
  // @ts-ignore
  CspTrustedSites: undefined,
  // @ts-ignore
  Dependencies: undefined,
  Description: '',
  Id: packageVersion0201SubscriberId,
  InstallValidationStatus: 'NO_ERRORS_DETECTED',
  IsBeta: true,
  IsDeprecated: false,
  IsManaged: false,
  IsOrgDependent: false,
  IsPasswordProtected: false,
  IsSecurityReviewed: false,
  MajorVersion: 0,
  MinorVersion: 2,
  Name: '',
  // @ts-ignore
  Package2ContainerOptions: undefined,
  PatchVersion: 0,
  PostInstallUrl: '',
  // @ts-ignore
  Profiles: undefined,
  PublisherName: '',
  ReleaseNotesUrl: '',
  ReleaseState: '',
  // @ts-ignore
  RemoteSiteSettings: undefined,
  SubscriberPackageId: '',
};

const subscriberPackageVersion0202: PackagingSObjects.SubscriberPackageVersion = {
  AppExchangeDescription: '',
  AppExchangeLogoUrl: '',
  AppExchangePackageName: '',
  AppExchangePublisherName: '',
  BuildNumber: 2,
  // @ts-ignore
  CspTrustedSites: undefined,
  // @ts-ignore
  Dependencies: undefined,
  Description: '',
  Id: packageVersion0202SubscriberId,
  InstallValidationStatus: 'NO_ERRORS_DETECTED',
  IsBeta: false,
  IsDeprecated: false,
  IsManaged: false,
  IsOrgDependent: false,
  IsPasswordProtected: false,
  IsSecurityReviewed: false,
  MajorVersion: 0,
  MinorVersion: 2,
  Name: '',
  // @ts-ignore
  Package2ContainerOptions: undefined,
  PatchVersion: 0,
  PostInstallUrl: '',
  // @ts-ignore
  Profiles: undefined,
  PublisherName: '',
  ReleaseNotesUrl: '',
  ReleaseState: '',
  // @ts-ignore
  RemoteSiteSettings: undefined,
  SubscriberPackageId: '',
};
*/

describe('chipps package version cleanup', () => {
  const $$ = new TestContext();
  const testOrg = new MockTestOrgData();
  const listVersionsStub = $$.SANDBOX.stub(Package, 'listVersions');

  // stubs
  let deleteStub: sinon.SinonStub;
  let packageVersionStub: sinon.SinonStub;

  beforeEach(async () => {
    deleteStub = $$.SANDBOX.stub();

    // The PackageVersion class is tested in the packaging library, so
    // we just stub the public APIs used by the command.
    packageVersionStub = $$.SANDBOX.stub().callsFake(() => ({
      delete: deleteStub,
    }));
    Object.setPrototypeOf(PackageVersion, packageVersionStub);
  });

  before(async () => {
    await $$.stubAuths(testOrg);
  });

  afterEach(() => {
    $$.restore();
  });

  it('should error without required --matcher flag', async () => {
    try {
      await PackageVersionCleanup.run([]);
    } catch (err) {
      const error = err as Error;
      expect(error.name).to.equal('Error');
      expect(error.message).to.include('Missing required flag matcher');
    }
  });

  it('should error without required --package flag', async () => {
    try {
      await PackageVersionCleanup.run(['--matcher', '2.0.2']);
    } catch (err) {
      const error = err as Error;
      expect(error.name).to.equal('Error');
      expect(error.message).to.include('Missing required flag package');
    }
  });

  it('should error without required --target-dev-hub flag', async () => {
    try {
      await PackageVersionCleanup.run(['--matcher', '2.0.2', '--package', myPackage0Hot]);
    } catch (err) {
      const error = err as Error;
      expect(error.name).to.equal('Error');
      expect(error.message).to.include('Missing required flag target-dev-hub');
    }
  });

  it('should select the correct versions for deletion', async () => {
    listVersionsStub.resolves([
      packageVersion0101ListResult,
      packageVersion0102ListResult,
      packageVersion0201ListResult,
      packageVersion0202ListResult,
    ]);

    deleteStub.reset();
    deleteStub = $$.SANDBOX.stub(PackageVersion.prototype, 'delete').resolves({
      errors: [],
      id: 'testId',
      success: true,
    } as PackageSaveResult);

    const results = await PackageVersionCleanup.run([
      '--matcher',
      '2.0.2',
      '--package',
      myPackage0Hot,
      '--target-devhub',
      'foor@bar.org',
    ]);

    expect(results).to.include('foo');
  });

  /* it('runs chipps package version cleanup ', async () => {
    await PackageVersionCleanup.run([]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.include('hello world');
  });

  it('runs hello world --name Astro', async () => {
    await PackageVersionCleanup.run(['--name', 'Astro']);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.include('hello Astro');
  });*/
});

/*
describe('package:version:cleanup', () => {
  const $$ = new TestContext();
  const testOrg = new MockTestOrgData();
  const config = new Config({ root: resolve(__dirname, '../../package.json') });
  let uxLogStub: sinon.SinonStub;
  let uxWarnStub: sinon.SinonStub;
  let uxConfirmStub: sinon.SinonStub;
  let packageVersionStub: sinon.SinonStub;
  let getExternalSitesStub: sinon.SinonStub;
  let installStub: sinon.SinonStub;
  let installStatusStub: sinon.SinonStub;

  const stubSpinner = (cmd: Install) => {
    $$.SANDBOX.stub(cmd.spinner, 'start');
    $$.SANDBOX.stub(cmd.spinner, 'stop');
  };

  before(async () => {
    await $$.stubAuths(testOrg);
    await config.load();
  });

  beforeEach(async () => {
    uxLogStub = $$.SANDBOX.stub(SfCommand.prototype, 'log');
    uxWarnStub = $$.SANDBOX.stub(SfCommand.prototype, 'warn');
  });

  afterEach(() => {
    $$.restore();
  });

  describe('package:install', () => {
    beforeEach(() => {
      getExternalSitesStub = $$.SANDBOX.stub();
      installStub = $$.SANDBOX.stub();
      installStatusStub = $$.SANDBOX.stub();
      uxConfirmStub = stubMethod($$.SANDBOX, SfCommand.prototype, 'confirm');

      // The SubscriberPackageVersion class is tested in the packaging library, so
      // we just stub the public APIs used by the command.
      packageVersionStub = $$.SANDBOX.stub().callsFake(() => ({
        install: installStub,
        getInstallStatus: installStatusStub,
      }));
      Object.setPrototypeOf(SubscriberPackageVersion, packageVersionStub);
    });

    it('should error without required --package param', async () => {
      try {
        const cmd = new Install(['-o', testOrg.username], config);
        stubSpinner(cmd);
        await cmd.run();
        expect(false, 'Expected required flag error').to.be.true;
      } catch (err) {
        const error = err as Error;
        expect(error.name).to.equal('Error');
        expect(error.message).to.include('Missing required flag package');
      }
    });

    it('should error with org API Version < 36.0', async () => {
      try {
        const cmd = new Install(['-p', myPackageVersion04t, '-o', testOrg.username, '--api-version', '33.0'], config);
        stubSpinner(cmd);
        await cmd.run();
        expect(false, 'Expected API version too low error').to.be.true;
      } catch (err) {
        const error = err as Error;
        expect(error.name).to.equal('ApiVersionTooLowError');
        expect(error.message).to.include('This command is supported only on API versions 36.0 and higher');
      }
    });

    it('should print IN_PROGRESS status correctly', async () => {
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);

      const cmd = new Install(['-p', myPackageVersion04t, '-o', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();

      expect(uxLogStub.calledOnce).to.be.true;
      const msg = `PackageInstallRequest is currently InProgress. You can continue to query the status using${EOL}sf package:install:report -i 0Hf1h0000006sh2CAA -o ${testOrg.username}`;
      expect(uxLogStub.args[0][0]).to.deep.equal(msg);
      expect(result).to.deep.equal(pkgInstallRequest);
      expect(installStub.args[0][0]).to.deep.equal(pkgInstallCreateRequest);
    });

    it('should print IN_PROGRESS status when timed out', async () => {
      const error = new SfError('polling timed out', 'PackageInstallTimeout');
      error.setData(pkgInstallRequest);
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').throws(error);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);
      const cmd = new Install(['-p', myPackageVersion04t, '-u', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();
      expect(uxLogStub.callCount).to.equal(1);
      const msg = `PackageInstallRequest is currently InProgress. You can continue to query the status using${EOL}sf package:install:report -i 0Hf1h0000006sh2CAA -o ${testOrg.username}`;
      expect(uxLogStub.args[0][0]).to.equal(msg);
      expect(uxWarnStub.firstCall.args[0]).to.include(
        'The "-u" flag has been deprecated. Use "--target-org | -o" instead.'
      );
      expect(result).to.deep.equal(pkgInstallRequest);
      expect(installStub.args[0][0]).to.deep.equal(pkgInstallCreateRequest);
    });

    it('should return PackageInstallRequest when polling timed out with --json', async () => {
      const error = new SfError('polling timed out', 'PackageInstallTimeout');
      error.setData(pkgInstallRequest);
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').throws(error);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);
      const cmd = new Install(['-p', myPackageVersion04t, '--json', '-o', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();
      expect(result).to.deep.equal(pkgInstallRequest);
      expect(installStub.args[0][0]).to.deep.equal(pkgInstallCreateRequest);
    });

    it('should print SUCCESS status correctly', async () => {
      const request = Object.assign({}, pkgInstallRequest, { Status: 'SUCCESS' });
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(request);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);

      const cmd = new Install(['-p', myPackageVersion04t, '-o', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();

      expect(uxLogStub.calledOnce).to.be.true;
      const msg = 'Successfully installed package [04t6A000002zgKSQAY]';
      expect(uxLogStub.args[0][0]).to.equal(msg);
      expect(result).to.deep.equal(request);
      expect(installStub.args[0][0]).to.deep.equal(pkgInstallCreateRequest);
    });

    it('should throw error for ERROR status and no install errors', async () => {
      const request = Object.assign({}, pkgInstallRequest, { Status: 'ERROR' });
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(request);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);
      try {
        const cmd = new Install(['-p', myPackageVersion04t, '-o', testOrg.username], config);
        stubSpinner(cmd);
        await cmd.run();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        const error = err as Error;
        expect(error.name).to.equal('PackageInstallError');
        expect(error.message).to.equal('Encountered errors installing the package! <empty>');
      }
    });

    it('should throw error for ERROR status with install errors', async () => {
      const request = Object.assign({}, pkgInstallRequest, {
        Status: 'ERROR',
        Errors: { errors: [new Error('message 1'), new Error('message 2')] },
      });
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(request);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);
      try {
        const cmd = new Install(['-p', myPackageVersion04t, '-o', testOrg.username], config);
        stubSpinner(cmd);
        await cmd.run();
        expect.fail('Expected error to be thrown');
      } catch (err) {
        const error = err as Error;
        expect(error.name).to.equal('PackageInstallError');
        expect(error.message).to.equal(
          'Encountered errors installing the package! Installation errors: \n1) message 1\n2) message 2'
        );
      }
    });

    it('should throw PackageAliasNotFoundError', async () => {
      try {
        const cmd = new Install(['-p', 'my_package_alias', '-o', testOrg.username], config);
        stubSpinner(cmd);
        await cmd.run();
        expect.fail('Expected InvalidAliasOrIdError to be thrown');
      } catch (err) {
        const error = err as Error;
        expect(error.name).to.equal('ErrorInvalidAliasOrIdError');
        expect(error.message).to.equal(
          'Invalid alias or ID: my_package_alias. Either your alias is invalid or undefined, or the ID (04t) provided is invalid.'
        );
      }
    });

    // TODO: It seems that while linking @salesforce/packaging into the plugin
    // we cannot stub the library calls of `SfProject.getInstance` e.g. "SfProject, 'getInstance'"
    // once the library has been published, the stubs resume to work and this test will pass
    it('should print SUCCESS status correctly for package alias', async () => {
      // Stubs SfProject.getInstance, SfProject.getSfProjectJson, and SfProjectJson.getContents
      // in a way that makes TS happy... all to test package aliases.
      const getContentsStub = stubMethod($$.SANDBOX, SfProjectJson.prototype, 'getContents').returns({
        packageAliases: { ['my_package_alias']: myPackageVersion04t },
      });
      const getSfProjectJsonStub = stubMethod($$.SANDBOX, SfProject.prototype, 'getSfProjectJson').callsFake(() => ({
        getContents: getContentsStub,
      }));
      const getPackageIdFromAliasStub = stubMethod($$.SANDBOX, SfProject.prototype, 'getPackageIdFromAlias').returns(
        myPackageVersion04t
      );
      stubMethod($$.SANDBOX, SfProject, 'getInstance').callsFake(() => ({
        getSfProjectJson: getSfProjectJsonStub,
        getPackageIdFromAlias: getPackageIdFromAliasStub,
      }));

      const request = Object.assign({}, pkgInstallRequest, { Status: 'SUCCESS' });
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(request);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);
      const cmd = new Install(['-p', 'my_package_alias', '-o', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();
      expect(uxLogStub.calledOnce).to.be.true;
      const msg = 'Successfully installed package [my_package_alias]';
      expect(uxLogStub.args[0][0]).to.equal(msg);
      expect(result).to.deep.equal(request);
      expect(installStub.args[0][0]).to.deep.equal(pkgInstallCreateRequest);
    });

    it('should use installation key as password', async () => {
      const installationkey = '1234abcd';
      const expectedCreateRequest = Object.assign({}, pkgInstallCreateRequest, { Password: installationkey });
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);
      const cmd = new Install(['-p', myPackageVersion04t, '-k', installationkey, '-o', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();
      expect(result).to.deep.equal(pkgInstallRequest);
      expect(installStub.args[0][0]).to.deep.equal(expectedCreateRequest);
    });

    it('sets PackageInstallRequest values for securityType, upgradeType, apexCompileType, SkipHandlers', async () => {
      const overrides = {
        ApexCompileType: 'package',
        SecurityType: 'full',
        UpgradeType: 'deprecate-only',
        SkipHandlers: 'FeatureEnforcement',
      };
      const expectedCreateRequest = Object.assign({}, pkgInstallCreateRequest, overrides);
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);

      const cmd = new Install(
        [
          '-p',
          myPackageVersion04t,
          '-a',
          overrides.ApexCompileType,
          '-s',
          'AllUsers',
          '-t',
          'DeprecateOnly',
          '-l',
          'FeatureEnforcement',
          '-o',
          testOrg.username,
        ],
        config
      );
      stubSpinner(cmd);
      const result = await cmd.run();

      expect(result).to.deep.equal(pkgInstallRequest);
      expect(installStub.args[0][0]).to.deep.equal(expectedCreateRequest);
    });

    it('should listen for PackageInstallRequest:warning events and log warnings', async () => {
      const warningMsg = 'test warning message';
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').callsFake(async () => {
        await Lifecycle.getInstance().emit(PackageEvents.install.warning, warningMsg);
        return pkgInstallRequest;
      });
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);

      const cmd = new Install(['-p', myPackageVersion04t, '-o', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();

      expect(uxLogStub.callCount).to.equal(1);
      expect(uxWarnStub.args[0][0]).to.equal(warningMsg);
      const msg = `PackageInstallRequest is currently InProgress. You can continue to query the status using${EOL}sf package:install:report -i 0Hf1h0000006sh2CAA -o ${testOrg.username}`;
      expect(uxLogStub.args[0][0]).to.equal(msg);
      expect(result).to.deep.equal(pkgInstallRequest);
    });

    it('should listen for Package/install-status polling events and log statuses', async () => {
      const successRequest = Object.assign({}, pkgInstallRequest, { Status: 'SUCCESS' });
      const waitForPublishStub = stubMethod(
        $$.SANDBOX,
        SubscriberPackageVersion.prototype,
        'waitForPublish'
      ).resolves();
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').callsFake(async () => {
        await Lifecycle.getInstance().emit(PackageEvents.install.status, pkgInstallRequest);
        await Lifecycle.getInstance().emit(PackageEvents.install.status, successRequest);
        return pkgInstallRequest;
      });
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);

      const cmd = new Install(['-p', myPackageVersion04t, '-w', '1', '-o', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();

      expect(uxLogStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(pkgInstallRequest);
      // wait for publish should only be called when --publish-wait flag is passed
      expect(waitForPublishStub.called).to.be.false;
    });

    it('should listen for Package/install-status and Package/install/subscriber-status polling events and log statuses', async () => {
      const successRequest = Object.assign({}, pkgInstallRequest, { Status: 'SUCCESS' });
      const waitForPublishStub = stubMethod(
        $$.SANDBOX,
        SubscriberPackageVersion.prototype,
        'waitForPublish'
      ).resolves();
      installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').callsFake(async () => {
        await Lifecycle.getInstance().emit(
          PackageEvents.install['subscriber-status'],
          'PACKAGE_UNAVAILABLE' as InstallValidationStatus
        );
        await Lifecycle.getInstance().emit(
          PackageEvents.install['subscriber-status'],
          'NO_ERRORS_DETECTED' as InstallValidationStatus
        );
        await Lifecycle.getInstance().emit(PackageEvents.install.status, pkgInstallRequest);
        await Lifecycle.getInstance().emit(PackageEvents.install.status, successRequest);
        return pkgInstallRequest;
      });
      stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves(subscriberPackageVersion);

      const cmd = new Install(['-p', myPackageVersion04t, '-w', '1', '-b', '2', '-o', testOrg.username], config);
      stubSpinner(cmd);
      const result = await cmd.run();

      expect(uxLogStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(pkgInstallRequest);
      expect(waitForPublishStub.calledOnce).to.be.true;
      expect(waitForPublishStub.args[0][0]).to.deep.equal({
        installationKey: undefined,
        publishFrequency: {
          quantity: 10,
          unit: 2,
        },
        publishTimeout: {
          quantity: 2,
          unit: 0,
        },
      });
    });

    describe('confirm upgrade type', () => {
      it('should NOT confirm UpgradeType with --no-prompt flag', async () => {
        installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
        stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves({
          ...subscriberPackageVersion,
          Package2ContainerOptions: 'Unlocked',
        });

        const cmd = new Install(
          ['-p', myPackageVersion04t, '-t', 'Delete', '--no-prompt', '-o', testOrg.username],
          config
        );
        stubSpinner(cmd);
        const result = await cmd.run();

        expect(uxConfirmStub.calledOnce).to.be.false;
        expect(result).to.deep.equal(pkgInstallRequest);
      });

      it('should confirm UpgradeType when NO --no-prompt flag', async () => {
        installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
        stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves({
          ...subscriberPackageVersion,
          Package2ContainerOptions: 'Unlocked',
        });
        uxConfirmStub.resolves(true);

        const cmd = new Install(['-p', myPackageVersion04t, '-t', 'Delete', '-o', testOrg.username], config);
        stubSpinner(cmd);
        const result = await cmd.run();

        expect(uxConfirmStub.calledOnce).to.be.true;
        expect(result).to.deep.equal(pkgInstallRequest);
      });

      it('should confirm UpgradeType and throw with no consent', async () => {
        installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
        stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves({
          ...subscriberPackageVersion,
          Package2ContainerOptions: 'Unlocked',
        });

        try {
          await new Install(['-p', myPackageVersion04t, '-t', 'Delete', '-o', testOrg.username], config).run();
          expect(false, 'Expected PromptUpgradeTypeDenyError').to.be.true;
        } catch (err) {
          const error = err as Error;
          expect(error.name).to.equal('PromptUpgradeTypeDenyError');
          expect(error.message).to.include('We canceled this package installation per your request.');
          expect(uxConfirmStub.calledOnce).to.be.true;
        }
      });

      it('should NOT confirm UpgradeType with non-Unlocked packages', async () => {
        installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
        stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves({
          ...subscriberPackageVersion,
          Package2ContainerOptions: 'Managed',
        });

        const cmd = new Install(
          ['-p', myPackageVersion04t, '-t', 'Delete', '--no-prompt', '-o', testOrg.username],
          config
        );
        stubSpinner(cmd);
        const result = await cmd.run();
        expect(uxConfirmStub.calledOnce).to.be.false;
        expect(result).to.deep.equal(pkgInstallRequest);
      });
    });

    describe('confirm external sites', () => {
      const extSites = ['url/for/site1', 'url/for/site2'];

      it('should NOT confirm external sites with --no-prompt flag', async () => {
        const expectedCreateRequest = Object.assign({}, pkgInstallCreateRequest, { EnableRss: true });
        getExternalSitesStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'getExternalSites').resolves(
          extSites
        );
        installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);

        const cmd = new Install(['-p', myPackageVersion04t, '--no-prompt', '-o', testOrg.username], config);
        stubSpinner(cmd);
        const result = await cmd.run();

        expect(getExternalSitesStub.calledOnce).to.be.true;
        expect(uxConfirmStub.calledOnce).to.be.false;
        expect(installStub.args[0][0]).to.deep.equal(expectedCreateRequest);
        expect(result).to.deep.equal(pkgInstallRequest);
      });

      it('should NOT confirm external sites with --no-prompt flag and installation key', async () => {
        const installationkey = '1234abcd';
        const expectedCreateRequest = Object.assign({}, pkgInstallCreateRequest, {
          EnableRss: true,
          Password: installationkey,
        });
        installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
        stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves({
          ...subscriberPackageVersion,
          RemoteSiteSettings: { settings: ['url/for/site1'] },
          CspTrustedSites: { settings: ['url/for/site2'] },
        });

        const cmd = new Install(
          ['-p', myPackageVersion04t, '--no-prompt', '-k', installationkey, '-o', testOrg.username],
          config
        );
        stubSpinner(cmd);
        const result = await cmd.run();

        expect(uxConfirmStub.calledOnce).to.be.false;
        expect(installStub.args[0][0]).to.deep.equal(expectedCreateRequest);
        expect(result).to.deep.equal(pkgInstallRequest);
      });

      it('should confirm external sites when NO --no-prompt flag (yes answer)', async () => {
        const expectedCreateRequest = Object.assign({}, pkgInstallCreateRequest, { EnableRss: true });
        installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
        stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves({
          ...subscriberPackageVersion,
          RemoteSiteSettings: { settings: [{ url: 'url/for/site1' }] },
          CspTrustedSites: { settings: [{ endpointUrl: 'url/for/site2' }] },
        });
        uxConfirmStub.resolves(true);

        const cmd = new Install(['-p', myPackageVersion04t, '-o', testOrg.username], config);
        stubSpinner(cmd);
        const result = await cmd.run();

        expect(uxConfirmStub.calledOnce).to.be.true;
        expect(uxConfirmStub.args[0][0]).to.include(extSites.join('\n'));
        expect(installStub.args[0][0]).to.deep.equal(expectedCreateRequest);
        expect(result).to.deep.equal(pkgInstallRequest);
      });

      it('should confirm external sites when NO --no-prompt flag (no answer)', async () => {
        installStub = stubMethod($$.SANDBOX, SubscriberPackageVersion.prototype, 'install').resolves(pkgInstallRequest);
        stubMethod($$.SANDBOX, Connection.prototype, 'singleRecordQuery').resolves({
          ...subscriberPackageVersion,
          RemoteSiteSettings: { settings: [{ url: 'url/for/site1' }] },
          CspTrustedSites: { settings: [{ endpointUrl: 'url/for/site2' }] },
        });

        const cmd = new Install(['-p', myPackageVersion04t, '-o', testOrg.username], config);
        stubSpinner(cmd);
        const result = await cmd.run();

        expect(uxConfirmStub.calledOnce).to.be.true;
        expect(uxConfirmStub.args[0][0]).to.include(extSites.join('\n'));
        expect(installStub.args[0][0]).to.deep.equal(pkgInstallCreateRequest);
        expect(result).to.deep.equal(pkgInstallRequest);
      });
    });
  });
});*/
