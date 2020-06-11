import * as chalk from 'chalk'
import * as cliSpinners from 'cli-spinners'
import * as ora from 'ora'

export function Log() {

    let starSuccess:boolean = true

    //console.log(ui.toString())
    const spinner = ora({text:chalk.hex('#c603fc')('1. Opening the Portal'),spinner:cliSpinners.arrow3,color:'white'}).start();
    const spinner2 = ora('2. Creating Star ')
    const spinner3 = ora('3. Injecting Modules ')
    const spinner4 = ora('4. Hypercompressing ')

    setTimeout(() => {
        spinner.succeed();
        spinner2.spinner = cliSpinners.arc;
        spinner2.start();
    }, 2000);

    setTimeout(() => {
        spinner2.succeed();
        spinner3.spinner = cliSpinners.bouncingBar;
        spinner3.start()
    }, 4000);

    setTimeout(() => {
        spinner3.succeed();
        spinner4.spinner = cliSpinners.star;
        spinner4.color = 'yellow'
        spinner4.start();
    }, 6000);

    setTimeout(() => {

        if (starSuccess == true){
            spinner4.succeed();
            console.log(chalk.bold.yellowBright('Successfully Created Neutron Star'))
        }
        else{
            spinner4.fail();
            console.log(chalk.bold.grey.bgRed('Error: Failed to Create Neutron Star! Initiated Nova.'))
        }
        //process.exit();
    }, 9000);

}