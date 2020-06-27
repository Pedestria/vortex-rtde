import * as chalk from 'chalk'
import * as cliSpinners from 'cli-spinners'
import * as ora from 'ora'
import { usingTerser, isProduction } from './Main'


    const spinner2 = ora('1. Opening the Portal')
    const spinner3 = ora('2. Vortex Commencing')
    const spinner4 = ora('3. Hypercompressing ')

    export function stage1(){
        spinner2.spinner = cliSpinners.arc;
        spinner2.start();
    }

    export function stage2 () {
        spinner2.succeed();
        spinner3.spinner = cliSpinners.bouncingBar;
        spinner3.start()
    }

    export function stage3 (){
        spinner3.succeed();
        spinner4.spinner = cliSpinners.star;
        spinner4.color = 'yellow'
        spinner4.start();
    }

    export function finish (output:string){

        if(usingTerser){
            spinner4.succeed()
            console.log(chalk.bold.yellowBright(`Successfully Created Neutron Star! (${output})`))
        }
        else{
            spinner3.succeed()
            console.log(chalk.bold.redBright(`Successfully Created Star! (${output})`))
        }
        process.exit();
    }
