/*
 * Copyright (c) 2023, Clay Chipps
 * All rights reserved.
 * Licensed under the MIT License.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/MIT
 */

import path from 'node:path';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { ensureString } from '@salesforce/ts-types';
import { expect } from 'chai';
import { Duration, Env } from '@salesforce/kit';

describe('chipps package dependencies install', () => {
  let session: TestSession;
  let devHub: string;

  before(async () => {
    devHub = ensureString(new Env().getString('TESTKIT_HUB_USERNAME'));
    session = await TestSession.create({
      devhubAuthStrategy: 'AUTO',
      project: {
        gitClone: 'https://github.com/trailheadapps/easy-spaces-lwc.git',
      },
      scratchOrgs: [
        {
          setDefault: true,
          config: path.join('config', 'project-scratch-def.json'),
        },
      ],
    });
  });

  after(async () => {
    await session?.clean();
  });

  it('should install package dependencies with polling', () => {
    const username = [...session.orgs.keys()][0];
    const command = `chipps package dependencies install --target-dev-hub ${devHub} --target-org ${username} --no-prompt --wait 20`;
    const output = execCmd(command, { ensureExitCode: 0, timeout: Duration.minutes(20).milliseconds }).shellOutput
      .stdout;
    expect(output).to.contain('Successfully installed package');
  });
});
