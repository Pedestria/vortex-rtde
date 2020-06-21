import GenerateGraph from './GraphGenerator'
import * as fs from 'fs-extra'
import Compile from './Compiler.js';
import { stage1, stage2, stage3, finish } from './Log.js';
import { usingTerser } from './Options.js';
import * as terser from 'terser'
import * as path from 'path'
//import * as Babel_Core from '@babel/core'

/**Creates a Star or Neutron Star from entry point.
 * 
 * @param {boolean} productionMode 
 * Production/Minified
 * @param {string} entry 
 * Define an entry point for Vortex
 * @param {string} output 
 * Name of output bundle.
 */ 

function createStarPackage (productionMode:boolean,entry:string,output:string){


  

    let isProduction:boolean = productionMode;

    let outputFilename = output

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
    let Graph = GenerateGraph(entry);
    stage2()
    let bundle = Compile(Graph);
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
      finish()
    }
    else{
      let credits = `/*STAR*/ \n /*${yourCredits.name} ${yourCredits.version} \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`
      fs.ensureDirSync(path.dirname(outputFilename) + '/')
      fs.writeFileSync(outputFilename,credits + bundle)
      finish()
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

export {createStarPackage/*vortexExpose*/} 