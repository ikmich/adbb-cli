import BaseCommand from '../BaseCommand.js';
import listDirEntries from '../../helpers/list-dir-entries.js';
import conprint from '../../helpers/conprint.js';
import { DIR_RECORDINGS } from '../../../constants.js';
import { ICommandInfo } from '../../../types/types.js';

class ListRecordingsCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run(): Promise<void> {
    await super.run();

    // const recordingsDir: string = '/sdcard/adbb/recordings';
    const entriesList: string[] = await listDirEntries(DIR_RECORDINGS, this.options.sid);

    conprint.info('\nadbb Recordings:');
    entriesList.forEach((entry: string) => {
      conprint.info(`-> ${entry}`);
    });

    console.log('');
  }
}

export default ListRecordingsCommand;
