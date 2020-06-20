import * as Commander from 'commander'
import * as Vortex from './Main'

let program = Commander.createCommand();


program.version('0.0.1a')
program
    .command('vortex <entryPoint> <output>')
    .action((entryPoint,output) => {
        Vortex.createStarPackage(false,entryPoint,output)
    })
    .parse(process.argv)





