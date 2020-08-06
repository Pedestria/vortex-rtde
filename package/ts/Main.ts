import {queue,GenerateGraph} from './GraphGenerator'
import {readJSONSync,writeFileSync,ensureDirSync} from 'fs-extra'
import {Compile, Bundle} from './Compiler.js';
import {VortexRTDEAPI, InternalVortexAddons,VortexAddon} from './API'
import * as terser from 'terser'
import * as path from 'path'
import * as chalk from 'chalk';
import * as cliSpinners from 'cli-spinners'
import * as ora from 'ora'
import * as os from 'os'
import { assignDependencyType } from './Planet';
import _ = require('lodash');
import { notNativeDependency } from './DependencyFactory';
import Dependency from './Dependency';
import {DependencyCircularCheck} from './Resolve'
import { indexOf, chain } from 'lodash';
import { VortexError, VortexErrorType } from './VortexError';

function ParseAddons(Addons:Array<VortexAddon>){

    var INTERALS:InternalVortexAddons = {
        extensions:{
            js:_.flatten(Addons.map(addon => addon.handler.exports.extend.jsExtensions)),
            other:_.flatten(Addons.map(addon => addon.handler.exports.extend.extensions))
        },
        importedDependencies:_.flatten(Addons.map(addon => addon.handler.exports.extend.custom.graph.dependenciesMap)),
        importedGraphers:_.flatten(Addons.map(addon => addon.handler.exports.extend.custom.graph.graphers)),
        importedCompilers:_.flatten(Addons.map(addon => addon.handler.exports.extend.custom.compiler.dependencyMapCompiler))
    }

    return INTERALS
}

//import * as Babel_Core from '@babel/core'
namespace ControlPanel {

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
    export var usingTerser:boolean

    export var outputFile:string

    /**If checked true, Vortex will encode File Dependency names with uuids.
     */
    export var encodeFilenames:boolean

    export var useDebug:boolean;

    export var startingPoint:string

    export var extensions:Array<string>

    export var polyfillPromise:boolean

    export var externalLibs:Array<string>

    export var InstalledAddons:InternalVortexAddons

    export var cssPlanet:boolean

    export var minifyCssPlanet:boolean

}

interface CLI{
    output:string
    start:string
    bundleMode:"neutronstar"|"star"
    type:"app"|"library"  
}


/**Creates a Star/Neutron Star/Solar System from entry point.
 *  
 */ 

export async function createStarPackage (resolvedPath:string,CLI?:CLI){

    var Panel;

    if(resolvedPath){
        Panel = require(path.relative(__dirname,resolvedPath))/*vortexRetain*/
    } else {
        Panel = CLI
    }

    ControlPanel.usingTerser = Panel.useTerser !== null? Panel.useTerser : false;
    ControlPanel.outputFile = Panel.output
    ControlPanel.encodeFilenames = Panel.encodeFilenames !== null? Panel.encodeFilenames : true
    ControlPanel.startingPoint = Panel.start
    ControlPanel.extensions = Panel.extensions
    ControlPanel.polyfillPromise = Panel.polyfillPromise
    ControlPanel.externalLibs = Panel.outBundle !== undefined? Panel.outBundle : []
    ControlPanel.InstalledAddons = Panel.addons.length > 0? ParseAddons(Panel.addons) : null
    ControlPanel.cssPlanet = Panel.cssPlanet
    ControlPanel.minifyCssPlanet = Panel.minifyCssPlanet


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

    
    let yourCredits = readJSONSync('./package.json',{encoding:'utf-8'})

    spinner2.spinner = cliSpinners.dots11;
    spinner2.start();

    let Graph = await GenerateGraph(entry,os.platform() === 'win32'? amendEntryPoint2(Panel.start) : Panel.start,ControlPanel)
    .catch(err => {
            spinner2.fail();
            LogVortexError(err);
            process.exit(1);
        });
    let check = DependencyCircularCheck(Graph);
    if(check.size > 0){
        spinner2.fail();
        errorCircularDependencies(check);
    }
    spinner2.succeed();
    spinner3.start();

    
    //Assign Entry Dependency For Planets
    for(let planet of Graph.Planets){
        if(!notNativeDependency(planet.entryModule,ControlPanel)){
            planet = assignDependencyType(planet,queue)
        } else{
            planet.entryDependency = new Dependency(planet.entryModule);
        }
    }

    let bundles = await Compile(Graph,ControlPanel)
    .catch(err => {
        spinner3.fail();
        LogVortexError(err);
        process.exit(1);
    })

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
                    console.log(chalk.magentaBright(` \n ${bundle.value}`))
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
 * @param {Bundle[]} bundleObjects Bundle Code Objects outputed by Compiler
 */

async function terserPackage(outputFilename:string,yourCredits,bundleObjects:Array<Bundle>){
    if(ControlPanel.isLibrary){
        let credits = `/*NEUTRON-STAR*/ \n /*COMMON JS IIFE */ \n /*BUNDLED BY VORTEX RTDE*/ \n /*${yourCredits.name} ${yourCredits.version} _MINIFIED_ \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`

            // var compileDownBundle = (await transformAsync(bundleObjects[0].code,{presets:[['@babel/preset-env',{modules:'commonjs'}]]})).code

            //console.log(credits)
            var minBundle = terser.minify(bundleObjects[0].code,{compress:true,mangle:true}).code

            
            let output = credits + minBundle
            //console.log(output)

            let newMainFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename,'.js') + '.min.js'
            ensureDirSync(path.dirname(outputFilename) + '/')
            writeFileSync(newMainFilename,output)

    }
    else{
        let credits = `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
        let planetCredits = `/*PLANET*/ \n /*BUNDLED BY VORTEX*/ \n`

        ensureDirSync(path.dirname(outputFilename) + '/')

        for(let bundle of bundleObjects){
            let filename:string
            if(bundle.value === 'star'){
                filename = outputFilename

                let mini = terser.minify(bundle.code,{compress:true,mangle:true}).code

                let finalB = credits + mini
                writeFileSync(filename,finalB)
            } else{
                filename = path.dirname(outputFilename) + '/' + bundle.value

                let mini = terser.minify(bundle.code,{compress:true,mangle:true}).code

                let finalB = planetCredits + mini
                writeFileSync(filename,finalB)
            }
        }

    }
    

}

async function regularPackage(outputFilename:string,yourCredits,bundleObjects:Array<Bundle>){
        if(ControlPanel.isLibrary){
            let finBund

                finBund = bundleObjects[0].code


                let credits = `/*STAR*/ \n /*COMMON JS IIFE */ \n /*BUNDLED BY VORTEX RTDE*/ \n /*${yourCredits.name} ${yourCredits.version} \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`
                ensureDirSync(path.dirname(outputFilename) + '/')
                writeFileSync(outputFilename,credits + finBund)
        } 
        else {
            let credits = ControlPanel.isProduction? `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n` : `/*STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
            let planetCredits = `/*PLANET*/ \n /*BUNDLED BY VORTEX*/ \n`
            ensureDirSync(path.dirname(outputFilename) + '/')

            for(let bundle of bundleObjects){
                let filename:string
                if(bundle.value === 'star'){
                    filename = outputFilename
    
                    let finalB = credits + bundle.code
                    writeFileSync(filename,finalB)
                } else{
                    filename = path.dirname(outputFilename) + '/' + bundle.value

                    let finalB = planetCredits + bundle.code
                    writeFileSync(filename,finalB)
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

function errorCircularDependencies(set:Set<string[]>){

    let chains:string[][] = [];

    set.forEach(value => chains.push(value))

    let loggedOutput = chains.map(chain => chain.join(' ~> ')).join('\n');

    var error:VortexError = new VortexError("Error! Circular References!! \n "+loggedOutput,VortexErrorType.StarSelfImposedError)
    throw error.printOut();
}

function LogVortexError(err:any){
    console.log(err);
}

export {VortexRTDEAPI}/*vortexExpose*/

// if(Panel.type !== 'live'){
//     createStarPackage();
// } else if(Panel.type === 'live'){
    
// }
//fs.writeJSONSync('out/importcool.json',Babel.parse(fs.readFileSync('./test/func.js').toString(),{"plugins":["dynamicImport"],"sourceType":"module"}))