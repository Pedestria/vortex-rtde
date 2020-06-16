import * as StarGraph from './GraphGenerator'
import * as fs from 'fs-extra'
import * as chalk from 'chalk'
import * as Logger from './Log'
import { resolveLibBundle } from './GraphGenerator';
import * as terser from 'terser'
import * as Babel from '@babel/parser'


export function createStarPackage (productionMode:boolean,entry:string){

  

    let isProduction:boolean = productionMode;

    // if (isProduction){
    //     process.env.NODE_ENV = 'production'
    // }
    // else{
    //     process.env.NODE_ENV = 'development'
    // }
    //Logger.Log();


    let Graph = StarGraph.default(entry);
    //console.log(Graph)

    fs.writeJson('./vortex-depGraph.json',Graph, err => {
        if (err) return console.error(err)
        console.log('Wrote Star Graph to dep-graph.json ')
      })

    //process.exit(0)

    // let buffer = fs.readFileSync('./test/func.js').toString()

    // let parsedCode = Babel.parse(buffer)

    // fs.writeJson('./debug.json',parsedCode, err => {
    //   if (err) return console.error(err)
    //   console.log('Wrote debug to ./debug.json ')
    // })

    

    //console.log(Graph.display());
}