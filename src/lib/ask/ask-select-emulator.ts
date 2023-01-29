import inquirer from 'inquirer';
import getEmulators from '../helpers/get-emulators.js';

const askSelectEmulator = async (label: string = 'Select emulator') => {
  const promptKey = 'emulator';
  const emulators: string[] = await getEmulators();
  if (emulators && emulators.length > 1) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: promptKey,
      message: label,
      choices: emulators,
    });

    return answer[promptKey];
  }
};

export default askSelectEmulator;
