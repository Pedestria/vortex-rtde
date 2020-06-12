import * as fs from 'fs-extra'
import { VortexGraph } from './Graph.js'
import * as EsModuleGrapher from './graphers/EsModuleGrapher'
import * as CjsModuleGrapher from './graphers/CommonJsModuleGrapher'
import * as resolve from 'resolve'
import path = require('path')
import { ResolveLibrary } from './Resolve.js'


export default function StarGraph(entry:string) {

    const node_modules:string = 'node_modules'

    //let resolvedEntry = path.resolve(entry)

    let Graph = new VortexGraph

    let fileLoc = './dep-graph.json';

    GraphDepsAndModsForCurrentFile(entry,Graph);
    
    for (let dep of Graph.Graph.Star){
        let regexp = new RegExp('./')

        if (dep.name.match(regexp) !== null) {
            //Local File Graphing
            GraphDepsAndModsForCurrentFile(dep.name,Graph)
        }
        else{
            //Node Lib Graphing
            GraphDepsAndModsForNodeLib(dep.name,Graph)
           
        }
        
    }
        //GraphDepsAndModsForNodeLib('react',Graph)
        return Graph
}


function GraphDepsAndModsForCurrentFile(file:string,Graph:VortexGraph){

    EsModuleGrapher.SearchAndGraph(file,Graph)
    CjsModuleGrapher.SearchAndGraph(file,Graph)
}

function GraphDepsAndModsForNodeLib(nodeLibName:string,Graph:VortexGraph){
    GraphDepsAndModsForCurrentFile(ResolveLibrary(nodeLibName),Graph)
}