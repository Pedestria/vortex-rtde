import GenerateGraph from './GraphGenerator'
import * as fs from 'fs-extra'
import * as Babel from '@babel/parser'
import Compile from './Compiler.js';
import { stage1, stage2, stage3, finish } from './Log.js';
import * as terser from 'terser'
import * as path from 'path'

import Panel from '../vortex.panel.js' /*vortexRetain*/ 

import chalk from 'chalk';
import { transformSync } from '@babel/core';
import { BabelSettings } from './Options';
import { getFileExtension } from './DependencyFactory';
import cliSpinners from 'cli-spinners'
import ora from 'ora'
import * as os from 'os'
//import * as Babel_Core from '@babel/core'

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

export function isJs(filename:string){
    let rc

    if(extensions.includes(getFileExtension(filename))){
        rc = false
    }
    else{
        rc = true
    }
    return rc
}

/**Creates a Star or Neutron Star from entry point.
 *  
 */ 

async function createStarPackage (){

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
        isProduction = false
    } else if(Panel.bundleMode === 'neutronstar'){
        isProduction = true
    }

    if(usingTerser === true && !isProduction){
        throw new Error(chalk.redBright('ERROR: Can not use terser on regular star!'))
    }

    if(Panel.type === 'app'){
        isLibrary = false
    } else if(Panel.type === 'library'){
        isLibrary = true
    }

    //PROGRAM -->

    
    let yourCredits = fs.readJSONSync('./package.json',{encoding:'utf-8'})

    spinner2.spinner = cliSpinners.arc;
    spinner2.start()
    let Graph = await GenerateGraph(entry,os.platform() === 'win32'? amendEntryPoint2(Panel.start) : Panel.start).catch(err => {console.log(err);process.exit(1);})
    spinner2.succeed();
    spinner3.start();
    let bundle = await Compile(Graph).catch(err => {console.log(err);process.exit(1);})
    let filename
    if(usingTerser){
        spinner3.succeed();
        spinner4.start();
        filename = terserPackage(outputFilename,yourCredits,bundle).catch(err => {console.log(err);process.exit(1);})
        spinner4.succeed();
        console.log(chalk.yellowBright(`Successfully Created Neutron Star! (${await filename})`))
    }
    else{
        spinner3.succeed();
        filename = regularPackage(outputFilename,yourCredits,bundle).catch(err => {console.log(err);process.exit(1);})
        console.log(chalk.redBright(`Successfully Created Star (${await filename})`))

    }
    
}


async function terserPackage(outputFilename:string,yourCredits,bundle:string){
    if(isLibrary){
        let credits = `/*NEUTRON-STAR*/ \n /*${yourCredits.name} ${yourCredits.version} _MINIFIED_ \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`
            //console.log(credits)
            let minBundle = terser.minify(bundle,{compress:true,mangle:true}).code
            let output = credits + minBundle
            //console.log(output)

            let newFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename,'.js') + '.min.js'
            fs.ensureDirSync(path.dirname(outputFilename) + '/')
            fs.writeFileSync(newFilename,output)
            return newFilename

    }
    else{
        let credits = `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
            let minBundle = terser.minify(bundle,{compress:true,mangle:true}).code

            let output = credits + minBundle

            let newFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename,'.js') + '.min.js'

            fs.ensureDirSync(path.dirname(outputFilename) + '/')
            fs.writeFileSync(newFilename,output)
            return newFilename
    }
    

}

async function regularPackage(outputFilename:string,yourCredits,bundle:string){
        if(isLibrary){
        // let bundle = Compile(Graph);
        ///let transformed = Babel_Core.transformSync(bundle,{sourceType:'module',presets:['@babel/preset-env']}).code
                let credits = `/*STAR*/ \n /*${yourCredits.name} ${yourCredits.version} \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`
                fs.ensureDirSync(path.dirname(outputFilename) + '/')
                fs.writeFileSync(outputFilename,credits + bundle)
                return outputFilename
        } 
        else{
                let credits = isProduction? `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n` : `/*STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
                let finalBundle = credits + bundle;
                fs.ensureDirSync(path.dirname(outputFilename) + '/')
                fs.writeFileSync(outputFilename,finalBundle)
                return outputFilename
        }

}

createStarPackage();

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