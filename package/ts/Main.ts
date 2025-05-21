import {queue,GenerateGraph} from './GraphGenerator'
import {readJSONSync,writeFileSync,ensureDirSync, exists, access, ensureDir, readJSON} from 'fs-extra'
import {Compile, Bundle} from './Compiler.js';
import {VortexRTDEAPI, InternalVortexAddons,VortexAddon, EnsuredPath, VTXPanel} from './API'
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
import { VortexError, VortexErrorType } from './VortexError';
import VortexAPI = require('../API_AND_Types');

function ParseAddons(panel:VTXPanel){

    var INTERALS:InternalVortexAddons = {
        extensions:{
            js:_.flatten(panel.addons.map(addon => addon.handler.exports.extend.jsExtensions)),
            other:_.flatten(panel.addons.map(addon => addon.handler.exports.extend.extensions))
        },
        importedDependencies:_.flatten(panel.addons.map(addon => addon.handler.exports.extend.custom.graph.dependenciesMap)),
        importedGraphers:_.flatten(panel.addons.map(addon => addon.handler.exports.extend.custom.graph.graphers)),
        importedCompilers:_.flatten(panel.addons.map(addon => addon.handler.exports.extend.custom.compiler.dependencyMapCompiler))
    }


    return INTERALS;
}



interface PackageJSON {
    name:string
    version:string
    author:string
    license:string
    description:string
};

function logBundleOutput(bundles: Bundle[],outputFilename:string){
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

/**Creates a Star/Neutron Star/Solar System from entry point.
 *  
 */ 
export async function createStarPackage (resolvedPath:string,CLI?:VTXPanel){

    var Panel: VTXPanel;

    if(resolvedPath){
        Panel = require(path.relative(__dirname,resolvedPath))/*vortexRetain*/
    } else {
        Panel = CLI
    }

    
    

    //SPINNERS -->

    const spinner2 = ora('1. Opening the Portal')
    const spinner3 = ora('2. Vortex Commencing')
    spinner3.spinner = cliSpinners.bouncingBar;
    const spinner4 = ora('3. Hypercompressing ')
    spinner4.spinner = cliSpinners.star;


    //CONFIG -->

    //Defaults to false when no input is given.

    let entry = Panel.start
    if(os.platform() === 'win32')
        entry = amendEntryPoint(Panel.start)
    
    let entry0 = new EnsuredPath(entry,access(entry));

    


    let outputFilename = Panel.output;


    if(Panel.usingTerser === true && !Panel.bundleMode){
        throw new Error(chalk.redBright('ERROR: Can not use terser on regular star!'))
    }

    //PROGRAM -->

    
    let yourCredits = readJSON('./package.json',{encoding:'utf-8'}) as Promise<PackageJSON>;

    spinner2.spinner = cliSpinners.dots11;
    spinner2.start();

    let Graph = await GenerateGraph(entry,os.platform() === 'win32'? amendEntryPoint2(Panel.start) : Panel.start,Panel)
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
        if(!notNativeDependency(planet.entryModule,Panel)){
            planet = assignDependencyType(planet,queue)
        } else{
            planet.entryDependency = new Dependency(planet.entryModule);
        }
    }

    let bundles = await Compile(Graph,Panel)
    .catch(err => {
        spinner3.fail();
        LogVortexError(err);
        process.exit(1);
    })

    let dirOkay = ensureDir(path.dirname(outputFilename) + '/');

    if(Panel.usingTerser){
        spinner3.succeed();
        spinner4.start();
        await terserPackage(outputFilename,yourCredits,bundles,Panel).catch(err => {console.log(err);process.exit(1);})
        spinner4.succeed();
        logBundleOutput(bundles,outputFilename)
    } else{
        await regularPackage(outputFilename,yourCredits,bundles,Panel).catch(err => {console.log(err);process.exit(1);})
        spinner3.succeed();
        logBundleOutput(bundles,outputFilename)
    }
}

function performPackageOperation(credits:string,planetCredits:string,outputFilename:string,bundleObjects:Bundle[]){
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

/**Packages bundles to files + minifies with Terser 
 * 
 * @param {string} outputFilename Star output file
 * @param yourCredits Credit JSON
 * @param {Bundle[]} bundleObjects Bundle Code Objects outputed by Compiler
 */

async function terserPackage(outputFilename:string,yourCredits:Promise<PackageJSON>,bundleObjects:Bundle[],panel:VTXPanel){
    try {
        let _yourCredits = await yourCredits;
        if(panel.isLibrary){
            let credits = `/*NEUTRON-STAR*/ \n /*COMMON JS IIFE */ \n /*BUNDLED BY VORTEX RTDE*/ \n /*${_yourCredits.name} ${_yourCredits.version} _MINIFIED_ \n ${_yourCredits.author} \n License: ${_yourCredits.license} \n ${_yourCredits.description} */ \n`

                // var compileDownBundle = (await transformAsync(bundleObjects[0].code,{presets:[['@babel/preset-env',{modules:'commonjs'}]]})).code

                //console.log(credits)
                var minBundle = terser.minify(bundleObjects[0].code,{compress:true,mangle:true}).code

                
                let output = credits + minBundle
                //console.log(output)

                let newMainFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename,'.js') + '.min.js'
                writeFileSync(newMainFilename,output)

        }
        else{
            let credits = `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
            let planetCredits = `/*PLANET*/ \n /*BUNDLED BY VORTEX*/ \n`


            performPackageOperation(credits,planetCredits,outputFilename,bundleObjects)

        }
        
    
    }
    catch
    (err){
        console.log(err);
        process.exit(1);
    }
}

async function regularPackage(outputFilename:string,yourCredits:Promise<PackageJSON>,bundleObjects:Bundle[],panel:VTXPanel){
    try {
        let _yourCredits = await yourCredits;
        if(panel.isLibrary){
            let finBund

                finBund = bundleObjects[0].code


                let credits = `/*STAR*/ \n /*COMMON JS IIFE */ \n /*BUNDLED BY VORTEX RTDE*/ \n /*${_yourCredits.name} ${_yourCredits.version} \n ${_yourCredits.author} \n License: ${_yourCredits.license} \n ${_yourCredits.description} */ \n`
              
                writeFileSync(outputFilename,credits + finBund)
        } 
        else {
            let credits = panel.isProduction? `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n` : `/*STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
            let planetCredits = `/*PLANET*/ \n /*BUNDLED BY VORTEX*/ \n` 

            performPackageOperation(credits,planetCredits,outputFilename,bundleObjects)
        }
    }catch(err){
        console.log(err);
        process.exit(1);
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

    var error:VortexError = new VortexError(`Error! Circular Reference${chains.length > 1? 's' : ''}!! \n `+loggedOutput,VortexErrorType.StarSelfImposedError)
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