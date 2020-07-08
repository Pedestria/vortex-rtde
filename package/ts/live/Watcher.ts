import * as Panel from '../../vortex.panel' /*vortexRetain*/

import * as cliSpinners from 'cli-spinners'
import * as ora from 'ora'

import * as readline from 'readline'
import { read } from 'fs'


/**Converts program to live package. (If prior package is cached, it will only push deltas to interpreter.)
 * Inputs from Panel:
 * - Entry point
 * 
 *Outputs to interpreter.
 */
function initLivePackage(){

    const spinner = ora('Initializing!')
    spinner.spinner = cliSpinners.dots10
    spinner.start()
    setTimeout(() => {
        spinner.succeed();
        console.log('Welcome to LivePush!')
    },3000)
}

function watchInput(){
    var hasAnwsered = false
    const pushSpinner = ora('Pushing >>> ')
    pushSpinner.spinner = cliSpinners.triangle
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    r1.question('Want to Push live changes?: (Y/N)', answer => {
        if(answer === 'Y'){
            pushSpinner.start()
            setTimeout(() => {
                pushSpinner.succeed()
                console.log('Pushed Updates')
                process.exit()
            },1000)
        } else {
            process.exit()
        }
    })
}

/**
 *  Converts Exports from AST into Shuttle Module Loader format.
 */
function convertExportsFromAST(){}

/**
 * Convert Imports from AST into Shuttle Module Loader format.
 */
function convertImportsFromAST(){}

watchInput()

