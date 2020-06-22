import inquirer from 'inquirer';

const askSelect = async (name: string = 'choice', message: string = 'Select choice', choices: any[]) => {
    if (choices && choices.length > 1) {
        const result = await inquirer.prompt({
            type: 'list',
            name,
            message,
            choices,
        });

        return result[name];
    }
    return '';
};

export default askSelect;
