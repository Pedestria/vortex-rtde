import * as Commander from 'commander'
import * as Vortex from './Main'

let program = Commander.createCommand();


program.version('0.0.1a')
program
    .command('vortex <entryPoint>')
    .action((entryPoint) => {
        Vortex.createStarPackage(false,entryPoint)
    })
    .parse(process.argv)





