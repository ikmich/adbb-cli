import inquirer from 'inquirer';

const askInput = async (name: string = 'input', message: string = 'Enter input') => {
    const result = await inquirer.prompt({
        type: 'input',
        name,
        message,
    });

    return result[name];
};

export default askInput;
