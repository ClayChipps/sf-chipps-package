import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sf-chipps-package', 'chipps.package.dependencies.install');

export type ChippsPackageDependenciesInstallResult = {
  path: string;
};

export default class ChippsPackageDependenciesInstall extends SfCommand<ChippsPackageDependenciesInstallResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    name: Flags.string({
      summary: messages.getMessage('flags.name.summary'),
      description: messages.getMessage('flags.name.description'),
      char: 'n',
      required: false,
    }),
  };

  public async run(): Promise<ChippsPackageDependenciesInstallResult> {
    const { flags } = await this.parse(ChippsPackageDependenciesInstall);

    const name = flags.name ?? 'world';
    this.log(
      `hello ${name} from C:\\Users\\clayc\\VSCode\\sf-chipps-package\\src\\commands\\chipps\\package\\dependencies\\install.ts`
    );
    return {
      path: 'C:\\Users\\clayc\\VSCode\\sf-chipps-package\\src\\commands\\chipps\\package\\dependencies\\install.ts',
    };
  }
}
