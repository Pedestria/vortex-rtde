import {queue,GenerateGraph} from './GraphGenerator'
import * as fs from 'fs-extra'
import {Compile} from './Compiler.js';
import * as terser from 'terser'
import * as path from 'path'

import * as Panel from '../vortex.panel.js' /*vortexRetain*/ 

import * as chalk from 'chalk';
import cliSpinners from 'cli-spinners'
import * as ora from 'ora'
import * as os from 'os'
import { assignDependencyType } from './Planet';
import { VortexAddon, ExportsHandler } from './Addon';
import { TestThread } from './Threads';
import EsModuleDependency from './dependencies/EsModuleDependency';

//import * as Babel_Core from '@babel/core'
export namespace ControlPanel {

    /**
     * If checked True, then Vortex will bundle with NO debug tools.
     * If checked False, then Vortex will bundle with debug tools.
     */
    export var isProduction:boolean
    /**
     * If checked true, Vortex will consider your program a library instead of a web application.
     */
    export var isLibrary:boolean
    /**
     * If checked true, Terser will be used to minify production bundle. (Can NOT be used on development bundles.) (Labels it Neutron Star)
     */
    export var usingTerser:boolean = Panel.useTerser !== null? Panel.useTerser : false;

    export var outputFile:string = Panel.output

    /**If checked true, Vortex will encode File Dependency names with uuids.
     */
    export var encodeFilenames:boolean = Panel.encodeFilenames !== null? Panel.encodeFilenames : true

    export var useDebug:boolean;

    export var extensions:Array<string> = Panel.extensions

    export var polyfillPromise:boolean = Panel.polyfillPromise

    export var externalLibs:Array<string> = Panel.outBundle

    export var VAddons:Array<ExportsHandler> = Panel.addons.map(addon => addon.handler)

}


/**Creates a Star/Neutron Star/Solar System from entry point.
 *  
 */ 

export async function createStarPackage (){

    //SPINNERS -->

    const spinner2 = ora('1. Opening the Portal')
    const spinner3 = ora('2. Vortex Commencing')
    spinner3.spinner = cliSpinners.bouncingBar;
    const spinner4 = ora('3. Hypercompressing ')
    spinner4.spinner = cliSpinners.star;


    //CONFIG -->

    //Defaults to false when no input is given.

    let entry = Panel.start

    if(os.platform() === 'win32'){
        entry = amendEntryPoint(Panel.start)
    }


    let outputFilename = Panel.output;

    if(Panel.bundleMode === 'star'){
        ControlPanel.isProduction = false
    } else if(Panel.bundleMode === 'neutronstar'){
        ControlPanel.isProduction = true
    }

    if(ControlPanel.usingTerser === true && !ControlPanel.isProduction){
        throw new Error(chalk.redBright('ERROR: Can not use terser on regular star!'))
    }

    if(Panel.type === 'app'){
        ControlPanel.isLibrary = false
    } else if(Panel.type === 'library'){
        ControlPanel.isLibrary = true
    }

    //PROGRAM -->

    
    let yourCredits = fs.readJSONSync('./package.json',{encoding:'utf-8'})

    spinner2.spinner = cliSpinners.dots11;
    spinner2.start();

    let Graph = await GenerateGraph(entry,os.platform() === 'win32'? amendEntryPoint2(Panel.start) : Panel.start).catch(err => {console.log(err);process.exit(1);})
    spinner2.succeed();
    spinner3.start();

    //Assign Entry Dependency For Planets
    for(let planet of Graph.Planets){
        planet = assignDependencyType(planet,queue)
    }

    let dep = new EsModuleDependency('',null);
    let jsonObj = JSON.parse(JSON.stringify(dep))

    let bundles = await Compile(Graph).catch(err => {console.log(err);process.exit(1);})

    if(ControlPanel.usingTerser){
        spinner3.succeed();
        spinner4.start();
        await terserPackage(outputFilename,yourCredits,bundles).catch(err => {console.log(err);process.exit(1);})
        spinner4.succeed();

        if(bundles.length === 1){
            console.log(chalk.yellowBright(`Successfully Created Neutron Star! ('${outputFilename}')`))
        }
        else {
            console.log(chalk.yellowBright(`Successfully Created Neutron Star! (Neutron Star outputed to '${outputFilename}')`))
            console.log(chalk.greenBright(`Planets Created: \n `))
            for(let bundle of bundles){
                if(bundle.value !== 'star'){
                    console.log(chalk.magentaBright(` \n ${bundle.valueOf().toString()}`))
                }
            }
        }
    } else{
        await regularPackage(outputFilename,yourCredits,bundles).catch(err => {console.log(err);process.exit(1);})
        spinner3.succeed();
        if(bundles.length === 1){
            console.log(chalk.rgb(252, 160, 20)(`Successfully Created Star! ('${outputFilename}')`))
        }
        else{
            console.log(chalk.rgb(252, 160, 20)(`Successfully Created Star! (Star outputed to '${outputFilename}') \n`))
            console.log(chalk.greenBright.underline(`Planets Created:`))
            for(let bundle of bundles){
                if(bundle.value !== 'star'){
                    console.log(chalk.yellowBright(` \n ${bundle.value}`))
                }
            }
        }
    }
}

/**Packages bundles to files + minifies with Terser 
 * 
 * @param {string} outputFilename Star output file
 * @param yourCredits Credit JSON
 * @param {Object[]} bundleObjects Bundle Code Objects outputed by Compiler
 */

async function terserPackage(outputFilename:string,yourCredits,bundleObjects:Array<Object>){
    if(ControlPanel.isLibrary){
        let credits = `/*NEUTRON-STAR*/ \n /*${yourCredits.name} ${yourCredits.version} _MINIFIED_ \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`
            //console.log(credits)
            for(let bundle of bundleObjects){
                if(bundle.value === 'star'){
                    var minBundle = terser.minify(bundle.code,{compress:true,mangle:true}).code
                }
            }
            let output = credits + minBundle
            //console.log(output)

            let newMainFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename,'.js') + '.min.js'
            fs.ensureDirSync(path.dirname(outputFilename) + '/')
            fs.writeFileSync(newMainFilename,output)

    }
    else{
        let credits = `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
        let planetCredits = `/*PLANET*/ \n /*BUNDLED BY VORTEX*/ \n`

        fs.ensureDirSync(path.dirname(outputFilename) + '/')

        for(let bundle of bundleObjects){
            let filename:string
            if(bundle.value === 'star'){
                filename = outputFilename

                let mini = terser.minify(bundle.code,{compress:true,mangle:true}).code

                let finalB = credits + mini
                fs.writeFileSync(filename,finalB)
            } else{
                filename = path.dirname(outputFilename) + '/' + bundle.value

                let mini = terser.minify(bundle.code,{compress:true,mangle:true}).code

                let finalB = planetCredits + mini
                fs.writeFileSync(filename,finalB)
            }
        }

    }
    

}

async function regularPackage(outputFilename:string,yourCredits,bundleObjects:Array<Object>){
        if(ControlPanel.isLibrary){
            let finBund
            for(let bundle of bundleObjects){
                if(bundle.value === 'star'){
                    finBund = bundle.code
                }
            }
                let credits = `/*STAR*/ \n /*${yourCredits.name} ${yourCredits.version} \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`
                fs.ensureDirSync(path.dirname(outputFilename) + '/')
                fs.writeFileSync(outputFilename,credits + finBund)
        } 
        else {
            let credits = ControlPanel.isProduction? `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n` : `/*STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
            let planetCredits = `/*PLANET*/ \n /*BUNDLED BY VORTEX*/ \n`
            fs.ensureDirSync(path.dirname(outputFilename) + '/')

            for(let bundle of bundleObjects){
                let filename:string
                if(bundle.value === 'star'){
                    filename = outputFilename
    
                    let finalB = credits + bundle.code
                    fs.writeFileSync(filename,finalB)
                } else{
                    filename = path.dirname(outputFilename) + '/' + bundle.value

                    let finalB = planetCredits + bundle.code
                    fs.writeFileSync(filename,finalB)
                }
            }
        }
}

function amendEntryPoint(entry:string){

    let shortEntry = entry.slice(2)

    while(shortEntry.includes('/')){
        let i = shortEntry.indexOf('/')
        let a = shortEntry.slice(0,i)
        let b = shortEntry.slice(i+1)
        shortEntry = `${a}\\${b}`
    }
    return `./${shortEntry}`
}

function amendEntryPoint2(entry:string){

    let shortEntry = entry.slice(2)

    while(shortEntry.includes('/')){
        let i = shortEntry.indexOf('/')
        let a = shortEntry.slice(0,i)
        let b = shortEntry.slice(i+1)
        shortEntry = `${a}\\\\${b}`
    }
    return `./${shortEntry}`
}

// if(Panel.type !== 'live'){
//     createStarPackage();
// } else if(Panel.type === 'live'){
    
// }
//fs.writeJSONSync('out/importcool.json',Babel.parse(fs.readFileSync('./test/func.js').toString(),{"plugins":["dynamicImport"],"sourceType":"module"}))

