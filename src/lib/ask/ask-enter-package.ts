import inquirer from 'inquirer';

const askEnterPackage = async (label: string = 'Enter application package (e.g. com.package.app):') => {
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'package',
        message: label,
    });

    return answer.package;
};

export default askEnterPackage;
