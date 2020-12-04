import inquirer from 'inquirer';
import getEmulators from '../helpers/get-emulators';

const askSelectEmulator = async (label: string = 'Select emulator') => {
  const emulators: string[] = await getEmulators();
  if (emulators && emulators.length > 1) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'emulator',
      message: label,
      choices: emulators,
    });

    return answer.emulator;
  }
};

export default askSelectEmulator;
