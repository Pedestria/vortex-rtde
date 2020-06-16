import * as fs from 'fs-extra'
import { VortexGraph } from './Graph.js'
import * as EsModuleGrapher from './graphers/EsModuleGrapher'
import * as CjsModuleGrapher from './graphers/CommonJsModuleGrapher'
import * as resolve from 'resolve'
import path = require('path')
import { ResolveLibrary, LocalizedResolve, addJsExtensionIfNecessary, resolveLibBundle } from './Resolve.js'
import { DefaultQuarkTable } from './QuarkTable.js'
import Dependency from './Dependency.js'
import ModuleDependency from './dependencies/ModuleDependency.js'
import { isProduction, isLibrary } from './Options.js'
//import * as terser from 'terser'



export default function StarGraph(entry:string) {

    if(isProduction){
        fs.emptyDirSync('./cache/files')
        fs.emptyDirSync('./cache/libs')
    }

    const node_modules:string = 'node_modules'

    //let resolvedEntry = path.resolve(entry)

    let Graph = new VortexGraph

    let fileLoc = './dep-graph.json';
    let loadedFilesCache:Array<String> = []

    GraphDepsAndModsForCurrentFile(addJsExtensionIfNecessary(entry),Graph);
    loadedFilesCache.push(entry)
    
    for (let dep of Graph.Graph.Star){
        let str = './'
        if (loadedFilesCache.includes(dep.name) == false){
            if (dep.name.includes(str) == true) {
                //Local File Graphing
                GraphDepsAndModsForCurrentFile(dep.name,Graph)
                loadedFilesCache.push(dep.name)
            }
            else{
                if(isLibrary == false){
                    GraphDepsForLib(dep,Graph)
                    loadedFilesCache.push(dep.name)
                }
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



// export function minifyIfProduction(file:string){
//     if(isProduction){ 
//         let fileName = path.basename(file,'.js')
//         let finalPath = './cache/files/' + fileName + '.min.js'
//         let min = terser.minify(fs.readFileSync(file).toString())
//         fs.ensureDirSync(path.dirname(finalPath))
//         fs.writeFileSync(finalPath,min.code)
//         return finalPath
//     }
//     else{
//         return addJsExtensionIfNecessary(file)
//     }