import * as fs from 'fs-extra'
import { VortexGraph } from './Graph.js'
import * as EsModuleGrapher from './graphers/EsModuleGrapher'
import * as CjsModuleGrapher from './graphers/CommonJsModuleGrapher'
import * as resolve from 'resolve'
import path = require('path')
import { ResolveLibrary, LocalizedResolve, addJsExtensionIfNecessary } from './Resolve.js'
import { DefaultQuarkTable } from './QuarkTable.js'
import Dependency from './Dependency.js'
import ModuleDependency from './dependencies/ModuleDependency.js'

var isProduction = false


export default function StarGraph(entry:string) {

    const node_modules:string = 'node_modules'

    //let resolvedEntry = path.resolve(entry)

    let Graph = new VortexGraph

    let fileLoc = './dep-graph.json';
    let loadedFilesCache:Array<String> = []

    GraphDepsAndModsForCurrentFile(entry,Graph);
    loadedFilesCache.push(entry)
    
    for (let dep of Graph.Graph.Star){
        let str = './'
        if (loadedFilesCache.includes(dep.name) == false){
            if (dep.name.includes(str) == true) {
                //Local File Graphing
                GraphDepsAndModsForCurrentFile(addJsExtensionIfNecessary(dep.name),Graph)
                loadedFilesCache.push(dep.name)
            }
            else{
                GraphDepsForLib(dep,Graph)
                loadedFilesCache.push(dep.name)
            }
        }
    }
    //console.log(loadedFilesCache)
        //console.log(loadedFilesCache)
        //console.log(resolveLibBundle("lodash",Graph,false))
        // console.log(resolveLibBundle('react'));
        //console.log(resolve.sync('aws-sdk'))
        //console.log(LocalizedResolve('./test/baha.js','../pooper/colop/mama.js'))
        return Graph
}


function GraphDepsAndModsForCurrentFile(file:string,Graph:VortexGraph){

    EsModuleGrapher.SearchAndGraph(file,Graph)
    CjsModuleGrapher.SearchAndGraph(file,Graph)
}

function GraphDepsForLib(dep:Dependency,Graph:VortexGraph){
    if(dep instanceof ModuleDependency){
        GraphDepsAndModsForCurrentFile(resolveLibBundle(dep.name),Graph)
    }
}

function resolveLibBundle(nodeLibName:string){
    //GraphDepsAndModsForCurrentFile(ResolveLibrary(nodeLibName),Graph)
    let minified = new RegExp('min')

    let bundles = ResolveLibrary(nodeLibName)
    if(bundles instanceof Array)
    {
        for(let lib of bundles){
            if (lib.match(minified) && isProduction){
                return lib
            }
            else if(lib.match(minified) == null && isProduction == false){
                return lib
            }
        }
    }
    else{
    return bundles
    }
}