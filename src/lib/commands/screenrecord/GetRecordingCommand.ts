import BaseCommand from '../BaseCommand.js';
import store from '../../helpers/store.js';
import buildAdbCommand from '../../helpers/build-adb-command.js';
import conprint from '../../helpers/conprint.js';
import execShellCmd from '../../helpers/exec-shell-cmd.js';
import listDirEntries from '../../helpers/list-dir-entries.js';
import { DIR_RECORDINGS } from '../../../constants.js';
import { devicesCheckWrapper } from '../../helpers/wrappers/devices-check-wrapper.js';
import { _fn } from '../../helpers/utils.js';
import { CommandActionDef, ICommandInfo } from '../../../types/types.js';

class GetRecordingCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run(): Promise<void> {
    await super.run();

    // if no recordings, show appropriate notice.
    const entries = (await listDirEntries(DIR_RECORDINGS, this.options.sid)) || [];
    if (entries.length === 0) {
      conprint.notice(`No recordings found. Run "adbb screenrec" to record your screen.`);
      store.clearLastRecording();
      return;
    }

    if (this.options.all) {
      console.log('-> Extracting all recording video files...');
      for (let filename of entries) {
        const recordingPath: string = `${DIR_RECORDINGS}/${filename}`;
        await this.extractSingleRecording(recordingPath);
      }
    } else {
      console.log('-> Extracting the latest recording video file...');
      const filename: string = entries[0];
      const recordingPath: string = `${DIR_RECORDINGS}/${filename}`;
      await this.extractSingleRecording(recordingPath);
    }
  }

  private async extractSingleRecording(recordingPath: string) {
    let isExtracted: boolean = false;

    try {
      // [check that the file exists]
      const ActionListDirEntries = {
        command: await buildAdbCommand(`shell ls "${recordingPath}"`),
        result: async (): Promise<string> => {
          return (await execShellCmd(ActionListDirEntries.command)) || '';
        },
      };

      const resListDirEntries = await ActionListDirEntries.result();
      if (resListDirEntries.toLowerCase().includes('no such file')) {
        conprint.notice(`Recording ${recordingPath} not found.`);
        return;
      }

      conprint.info(`Pulling "${recordingPath}" from device to current directory...`);

      const destDir: string = process.cwd();
      const ActionPullFile: CommandActionDef = {
        command: await buildAdbCommand(`pull "${recordingPath}" "${destDir}"`, this.options.sid),
        async result() {
          return await execShellCmd(ActionPullFile.command);
        },
      };
      // const shellCmd: string = await buildAdbCommand(`pull "${recordingPath}" "${destDir}"`, this.options.sid);
      const result: string = await ActionPullFile.result();
      console.log(result);

      isExtracted = true;
    } catch (e) {
      conprint.error(e);
    }

    if (isExtracted) {

      // [delete the file]
      await devicesCheckWrapper(async (device: string | null) => {
        try {
          const deviceChoiceSwitchFlag: string = _fn(() => {
            if (device) {
              return `-s ${device}`;
            } else {
              return '';
            }
          });

          const cmdDelete: string = `adb ${deviceChoiceSwitchFlag} shell rm ${recordingPath}`;
          const result: string = await execShellCmd(cmdDelete);
          console.log(result);

          conprint.info(`Recording file ${recordingPath} deleted from device.`);
          console.log('----');
        } catch (e) {
          conprint.error(`Error deleting recording file at ${recordingPath}`);
          conprint.error(e);
        }
      });

    }
  }
}

export default GetRecordingCommand;
