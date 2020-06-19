import * as StarGraph from './GraphGenerator'
import * as fs from 'fs-extra'
import Compile from './Compiler.js';
import { VortexGraph } from './Graph.js';
//import * as chalk from 'chalk'
//import * as Logger from './Log'
//import { resolveLibBundle } from './GraphGenerator';
//import * as terser from 'terser'
import * as Babel from '@babel/parser'
import { stage1, stage2, stage3, finish } from './Log.js';
import { usingTerser } from './Options.js';
import * as terser from 'terser'
import * as path from 'path'


export function createStarPackage (productionMode:boolean,entry:string){


  

    let isProduction:boolean = productionMode;

    let outputFilename = './out/vortex.js'

    // if (isProduction){
    //     process.env.NODE_ENV = 'production'
    // }
    // else{
    //     process.env.NODE_ENV = 'development'
    // }
    //Logger.Log();

    // fs.writeJsonSync('./out/tree.json',Babel.parse(fs.readFileSync('./test/func.js').toString(),{"sourceType":"module"}))


    stage1()
    let Graph = StarGraph.default(entry);
    stage2()
    let bundle = Compile(Graph);
    if(usingTerser){
      stage3()
      let yourCredits = fs.readJsonSync('./package.json')
      let credits = `/*********NEUTRON-STAR*********/ \n ${yourCredits.name} ${yourCredits.version} \n ${yourCredits.author} \n License:${yourCredits.license} \n ${yourCredits.description} \n`
      let output = Promise.resolve(terser.minify(bundle,{compress:true,mangle:true}).code).then((minBundle) => {
          return credits + minBundle
      })
      let newFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename,'.js') + '.min.js'
      fs.writeFile(newFilename,output)
      finish()
    }
    else{
      fs.writeFileSync(outputFilename,bundle)
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