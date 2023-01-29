import buildAdbCommand from './build-adb-command.js';
import execShellCmd from './exec-shell-cmd.js';

const listDirEntries = async (dirPath: string, deviceSid?: string): Promise<string[]> => {
  const cmdListEntries = await buildAdbCommand(`shell ls -t "${dirPath}"`, deviceSid);
  const listEntriesResult = await execShellCmd(cmdListEntries);

  // split into array
  return listEntriesResult.split(/\n+/);
};

export default listDirEntries;
