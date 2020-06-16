import inquirer from 'inquirer';

const askEnterPackage = async () => {
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'package',
        message: 'Enter application package (e.g. com.package.app):'
    });

    return answer.package;
};

export default askEnterPackage;