import { TestContext } from '@salesforce/core/lib/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import ChippsPackageVersionCleanup from '..\\..\\..\\..\\..\\src\\commands\\chipps\\package\\version\\cleanup';

describe('chipps package version cleanup', () => {
  const $$ = new TestContext();
  let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  beforeEach(() => {
    sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('runs hello', async () => {
    await ChippsPackageVersionCleanup.run([]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.include('hello world');
  });

  it('runs hello with --json and no provided name', async () => {
    const result = await ChippsPackageVersionCleanup.run([]);
    expect(result.path).to.equal(
      'C:\\Users\\clayc\\VSCode\\sf-chipps-package\\src\\commands\\chipps\\package\\version\\cleanup.ts'
    );
  });

  it('runs hello world --name Astro', async () => {
    await ChippsPackageVersionCleanup.run(['--name', 'Astro']);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.include('hello Astro');
  });
});
