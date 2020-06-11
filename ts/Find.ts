import * as fs from 'fs-extra'
import { VortexGraph } from './Graph.js'
import * as EsModuleGrapher from './graphers/EsModuleGrapher'


export function GraphStar(entry:string) {

    const node_modules:string = 'node_modules'

    let Graph = new VortexGraph

    let fileLoc = './dep-graph.json';

    GraphDepsAndModsForCurrentFile(entry,Graph);
    
    for (let dep of Graph.Graph.Star){
        let regexp = new RegExp('./')

        if (dep.name.match(regexp) !== null) {
            GraphDepsAndModsForCurrentFile(dep.name,Graph)
        }

    }
        //console.log(c)
        //console.log(modules)
        //console.log(dependencies)
        //console.log(Graph.display())
        fs.writeJson(fileLoc,Graph, err => {
            if (err) return console.error(err)
            console.log('Wrote App Graph to ' + fileLoc)
          })
        //resolveDependencies(dependencies,node_modules)
}


function GraphDepsAndModsForCurrentFile(file:string,Graph:VortexGraph){

    EsModuleGrapher.SearchAndGraph(file,Graph)
}