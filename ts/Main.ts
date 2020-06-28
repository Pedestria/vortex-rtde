import GenerateGraph from './GraphGenerator'
import * as fs from 'fs-extra'
import * as Babel from '@babel/parser'
import Compile from './Compiler.js';
import { stage1, stage2, stage3, finish } from './Log.js';
import * as terser from 'terser'
import * as path from 'path'
import Panel = require('../vortex.panel.js')
import * as chalk from 'chalk';
import { transformSync } from '@babel/core';
import { BabelSettings } from './Options';
import { getFileExtension } from './DependencyFactory';
//import * as Babel_Core from '@babel/core'

/**
 * If checked True, then Vortex will bundle with NO debug tools.
 * If checked False, then Vortex will bundle with debug tools.
 */
export var isProduction:boolean;
/**
 * If checked true, Vortex will consider your program a library instead of a web application.
 */
export var isLibrary:boolean
/**
 * If checked true, Terser will be used to minify production bundle. (Can NOT be used on development bundles.) (Labels it Neutron Star)
 */
export var usingTerser:boolean = false;

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

function createStarPackage (){

    let outputFilename = Panel.output;

    if(Panel.bundleMode === 'star'){
        isProduction = false
    } else if(Panel.bundleMode === 'neutronstar'){
        isProduction = true
    }

    if(Panel.useTerser == true && !isProduction){
        throw new Error(chalk.redBright('ERROR: Can not use terser on regular star!'))
    }
    //Assignment to config from Panel

    usingTerser = Panel.useTerser
    if(Panel.type === 'app'){
        isLibrary = false
    } else if(Panel.type === 'library'){
        isLibrary = true
    }

    
    // if (isProduction){
    //     process.env.NODE_ENV = 'production'
    // }
    // else{
    //     process.env.NODE_ENV = 'development'
    // }
    //Logger.Log();

    // fs.writeJsonSync('./out/tree.json',Babel.parse(fs.readFileSync('./test/func.js').toString(),{"sourceType":"module"}))
    let yourCredits = fs.readJSONSync('./package.json',{encoding:'utf-8'})

    stage1()
    let Graph = GenerateGraph(Panel.start);
    console.log(Graph)
    stage2()
    let bundle = Compile(Graph);

    if(isLibrary){
    // let bundle = Compile(Graph);
    ///let transformed = Babel_Core.transformSync(bundle,{sourceType:'module',presets:['@babel/preset-env']}).code

        if(usingTerser){
            stage3()
            let credits = `/*NEUTRON-STAR*/ \n /*${yourCredits.name} ${yourCredits.version} _MINIFIED_ \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`
            //console.log(credits)
            let minBundle = terser.minify(bundle,{compress:true,mangle:true}).code
            let output = credits + minBundle
            //console.log(output)

            let newFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename,'.js') + '.min.js'
            fs.ensureDirSync(path.dirname(outputFilename) + '/')
            fs.writeFileSync(newFilename,output)
            finish(newFilename)
        }

        else{
            let credits = `/*STAR*/ \n /*${yourCredits.name} ${yourCredits.version} \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`
            fs.ensureDirSync(path.dirname(outputFilename) + '/')
            fs.writeFileSync(outputFilename,credits + bundle)
            finish(outputFilename)
        }
    } 
    else{
        if(usingTerser){
            stage3()
            let credits = `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
            let minBundle = terser.minify(bundle,{compress:true,mangle:true}).code

            let output = credits + minBundle

            let newFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename,'.js') + '.min.js'

            fs.ensureDirSync(path.dirname(outputFilename) + '/')
            fs.writeFileSync(newFilename,output)
            finish(newFilename)
        }
        else{
            let credits = isProduction? `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n` : `/*STAR*/ \n /*BUNDLED BY VORTEX*/ \n`
            let finalBundle = credits + bundle;
            fs.ensureDirSync(path.dirname(outputFilename) + '/')
            fs.writeFileSync(outputFilename,finalBundle)
            finish(outputFilename)
        }
    }


    // fs.writeJson('./vortex-depGraph.json',Graph, err => {
    //     if (err) return console.error(err)
    //     console.log('Wrote Star Graph to dep-graph.json ')
    //   })

    // process.exit(0)

    // let buffer = fs.readFileSync('./test/func.js').toString()

    // let parsedCode = Babel.parse(buffer)

    // fs.writeJson('./debug.json',parsedCode, err => {
    //   if (err) return console.error(err)
    //   console.log('Wrote debug to ./debug.json ')
    // })

    

    //console.log(Graph.display());
}

createStarPackage()
