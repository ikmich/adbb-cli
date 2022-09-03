import askSelect from './ask-select.js';

const askSelectMultiple = async (name: string = 'choice', message: string = 'Select choice', choices: any[]) => {
  return await askSelect(name, message, choices, true);
};

export default askSelectMultiple;
