import BaseCommand from '../BaseCommand.js';
import conprint from '../../helpers/conprint.js';
import parseError from '../../errors/parse-error.js';
import dateFns from 'date-fns';
import buildAdbCommand from '../../helpers/build-adb-command.js';
import execShellCmd from '../../helpers/exec-shell-cmd.js';
import { _fn } from '../../helpers/utils.js';
import store from '../../helpers/store.js';
import askInput from '../../ask/ask-input.js';
import ListRecordingsCommand from './ListRecordingsCommand.js';
import GetRecordingCommand from './GetRecordingCommand.js';
import listDirEntries from '../../helpers/list-dir-entries.js';
import { deleteFile } from '../../helpers/delete-file.js';
import { DIR_RECORDINGS } from '../../../constants.js';
import { ICommandInfo } from '../../../types/types.js';

/**
 * Command to make video recording of the device screen for a max time of 3 minutes.
 */
class ScreenRecordCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    const Args = {
      ls: this.args.includes('ls'),
      pull: this.args.includes('pull'),
      purge: this.args.includes('purge'),
      clear: this.args.includes('clear'),
    };

    switch (true) {
      case Args.ls:
      case this.options.list: {
        await new ListRecordingsCommand(this.commandInfo).run();
        break;
      }

      case Args.pull: {
        await new GetRecordingCommand(this.commandInfo).run();
        break;
      }

      case Args.purge:
      case Args.clear: {
        await this.actionPurgeRecordings();
        break;
      }

      default:
        await this.actionScreenRecord();
        break;
    }
  }

  private async actionScreenRecord() {
    const FORMAT: string = 'yyyyMMdd_hhmmss_SSSS';

    try {
      const formattedDate = dateFns.format(new Date(), FORMAT);
      let fileName: string = `adbb_recording_${formattedDate}.mp4`;
      const deviceDirPath: string = DIR_RECORDINGS;
      const deviceRecordingPath: string = `${deviceDirPath}/${fileName}`;

      // Create folder on device for adbb recordings...
      await _fn(async () => {
        const shellCmd = await buildAdbCommand(`shell mkdir -p ${deviceDirPath}`, this.options.sid);
        await execShellCmd(shellCmd);
      });

      store.saveLastRecording(deviceRecordingPath);

      conprint.plain(`The recording is about to start. Note the following:`);
      conprint.plain(`-> The recording will be saved on your android device at ${deviceRecordingPath}`);
      conprint.plain(`-> To get/extract your last recorded video file, run "adbb screenrec --get".`);
      conprint.plain(`-> To see a list of all the adbb recordings, run "adbb screenrec --list".`);
      conprint.plain(`-> To delete all the recordings, run "adbb screenrec --purge".`);
      conprint.plain(`-> TO STOP RECORDING, press CTRL + C`);

      const answer = (await askInput('recording-consent', 'Press ENTER to start recording. Press X to cancel')) ?? '';

      if (answer.toLowerCase() === 'x' || answer !== '') {
        // cancel recording
        conprint.plain('Action canceled');
        return;
      }

      const FORMAT2: string = 'yyyy-MM-dd hh:mm:ss:SSSS';
      conprint.plain(`-> Recording started at ${dateFns.format(new Date(), FORMAT2)}.`);

      let shellCommand = await buildAdbCommand(`shell screenrecord ${deviceRecordingPath}`, this.options.sid);
      const result = await execShellCmd(shellCommand);
      conprint.info(result);
    } catch (e) {
      conprint.error(parseError(e));
    }
  }

  private async actionPurgeRecordings() {
    const recordingsDir: string = DIR_RECORDINGS;
    const entriesList: string[] = await listDirEntries(recordingsDir, this.options.sid);

    for (let entry of entriesList) {
      const filepath: string = `${recordingsDir}/${entry}`;
      conprint.info(`-> ${filepath}`);
      await deleteFile(filepath);
    }

    console.log('');
  }
}

export default ScreenRecordCommand;
