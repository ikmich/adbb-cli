import inquirer from 'inquirer';
import {yes} from '../helpers/utils';

const askSelect = async (
    name: string = 'choice',
    message: string = 'Select choice',
    choices: any[],
    multiple = false,
) => {
  if (choices && choices.length > 0) {
    const result = await inquirer.prompt({
      type: yes(multiple) ? 'checkbox' : 'list',
      name,
      message,
      choices,
    });

    return result[name];
  }
  return '';
};

export default askSelect;
