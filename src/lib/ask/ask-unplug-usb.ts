import inquirer from 'inquirer';

const askUnplugUsb = async () => {
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'unplugged',
        message: 'UNPLUG DEVICE FROM USB, THEN PRESS ENTER:'
    });

    return answer.unplugged;
};

export default askUnplugUsb;