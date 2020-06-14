import * as StarGraph from './StarGraph'
import * as fs from 'fs-extra'
import * as chalk from 'chalk'
import * as Logger from './Log'
import { resolveLibBundle } from './StarGraph';
import * as terser from 'terser'


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
    console.log(Graph)

    fs.writeJson('./dep-graph.json',Graph, err => {
        if (err) return console.error(err)
        console.log('Wrote Star Graph to dep-graph.json ')
      })

    //console.log(Graph.display());
}