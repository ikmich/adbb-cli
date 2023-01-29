import inquirer, { Answers } from 'inquirer';

const askInput = async (name: string = 'input', message: string = 'Enter input') => {
  const questionObj: Record<string, any> = {
    type: 'input',
    name,
    message,
  };
  const result: Answers = await inquirer.prompt(questionObj);

  return result[name];
};

export default askInput;
