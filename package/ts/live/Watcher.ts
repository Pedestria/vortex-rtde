import {ControlPanel} from '../Main'

import * as cliSpinners from 'cli-spinners'
import * as ora from 'ora'
import * as chokidar from 'chokidar'
import * as path from 'path'
import * as diff from 'diff'

import * as readline from 'readline'


/**Converts program to live package. (If prior package is cached, it will only push deltas to interpreter.)
 * Inputs from Panel:
 * - Entry point
 * 
 *Outputs to interpreter.
 */
function initLivePackage(){

    // const spinner = ora('Initializing!')
    // spinner.spinner = cliSpinners.dots10
    // spinner.start()
    // setTimeout(() => {
    //     spinner.succeed();
    //     console.log('Welcome to LivePush!')
    // },3000)
}

function watchInput(){

    const watcher = chokidar.watch([ControlPanel.startingPoint,path.dirname(ControlPanel.startingPoint)],{persistent:true})

    const log = console.log.bind(console);

    watcher
  .on('add', path => log(`File ${path} has been added`))
  .on('change', path => log(`File ${path} has been changed`))
  .on('unlink', path => log(`File ${path} has been removed`));
 
// More possible events.
watcher
  .on('addDir', path => log(`Directory ${path} has been added`))
  .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'))
  .on('raw', (event, path, details) => { // internal
    log('Raw event info:', event, path, details);
  });
 
// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', (path, stats) => {
  if (stats) console.log(`File ${path} changed size to ${stats.size}`);
});
 
// Watch new files.
watcher.add('new-file');
    // var hasAnwsered = false
    // const pushSpinner = ora('Pushing >>> ')
    // pushSpinner.spinner = cliSpinners.triangle
    // const r1 = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout
    // })
    // r1.question('Want to Push live changes?: (Y/N)', answer => {
    //     if(answer === 'Y'){
    //         pushSpinner.start()
    //         setTimeout(() => {
    //             pushSpinner.succeed()
    //             console.log('Pushed Updates')
    //             process.exit()
    //         },1000)
    //     } else {
    //         process.exit()
    //     }
    // })
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

