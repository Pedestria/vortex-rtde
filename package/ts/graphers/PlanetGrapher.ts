import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { QueueEntry } from '../GraphGenerator';
import { VortexGraph } from '../Graph';
import { Planet } from '../Planet';
import { LocalizedResolve, resolveLibBundle } from '../Resolve';

function namePlanet(Graph:VortexGraph){
    return `planet_${Graph.Planets.length}.js`
}

export function SearchAndGraph(entry:QueueEntry, Graph:VortexGraph){

    traverse(entry.ast, {
        CallExpression: function(path){
            if(path.node.callee.type === "Import"){
                let name = path.node.arguments[0].value
                let ent:string

                if(name.includes('./')){
                    ent = LocalizedResolve(entry.name,name)
                } else{
                    ent = resolveLibBundle(name)
                }

                if(Graph.planetExists(ent)){
                    Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(entry.name)
                }
                else{
                    let planet = new Planet(namePlanet(Graph),ent)
                    planet.originalName = path.node.arguments[0].value
                    Graph.Planets.push(planet)
                    Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(entry.name)
                }
            }
        }
    })

}