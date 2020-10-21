import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { QueueEntry } from '../GraphGenerator';
import { VortexGraph } from '../Graph';
import { Planet, PlanetClusterMapObject, PlanetImportLocation } from '../Planet';
import { LocalizedResolve, resolveLibBundle } from '../Resolve';
import { ParseResult } from '@babel/core';
import { ControlPanel } from '../types/ControlPanel';

function namePlanet(Graph:VortexGraph){
    return `planet_${Graph.Planets.length}.js`
}

/**Searchs code of provided entry and Graphs Planets from ES Dynamic Imports and AMD Define Imports.
 * 
 * @param {QueueEntry} entry 
 * @param {VortexGraph} Graph 
 */

export function SearchAndGraph(entry:QueueEntry, Graph:VortexGraph,ControlPanel:ControlPanel){

    traverse(entry.ast as ParseResult, {
        CallExpression: function(path){
            //Dynamic Import Grapher
            if(path.node.callee.type === "Import"){
                let name = (path.node.arguments[0] as t.StringLiteral).value
                let isLib:boolean
                let ent:string

                if(name.includes('./')){
                    ent = LocalizedResolve(entry.name,name)
                    isLib = false
                } else{
                    ent = resolveLibBundle(name,ControlPanel)
                    isLib = true
                }

                if(Graph.planetExists(ent)){
                    Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(new PlanetImportLocation(entry.name,false))
                }
                else{
                    let planet = new Planet(namePlanet(Graph),ent)
                    planet.originalName = (path.node.arguments[0] as t.StringLiteral).value
                    planet.entryModuleIsLibrary = isLib
                    Graph.Planets.push(planet)
                    Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(new PlanetImportLocation(entry.name,false))
                }
            }// AMD Define Grapher
             else if(path.node.callee.type === "Identifier" && path.node.callee.name === 'define' && path.node.arguments[0].type === 'ArrayExpression') {
                 let originalNames:Array<string> = []
                 let newNames:Array<string> = []
                 if(path.node.arguments[0].type === 'ArrayExpression'){
                    for(let imprt of path.node.arguments[0].elements){
                            //imprt is a String Literal in this case!
                            let name:string = (imprt as t.StringLiteral).value;
                            let isLib:boolean
                            let ent:string

                            if(name.includes('./')){
                                ent = LocalizedResolve(entry.name,name)
                                isLib = false
                            } else{
                                ent = resolveLibBundle(name,ControlPanel)
                                isLib = true
                            }

                            if(Graph.planetExists(ent)){
                                Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(new PlanetImportLocation(entry.name,true))
                            }
                            else{
                                let planet = new Planet(namePlanet(Graph),ent)
                                planet.originalName = (imprt as t.StringLiteral).value
                                originalNames.push(planet.originalName)
                                newNames.push(planet.name)
                                planet.entryModuleIsLibrary = isLib
                                Graph.Planets.push(planet)
                                Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(new PlanetImportLocation(entry.name,true))
                            }
                    }
                }
                let PlanetClusterMapObj = new PlanetClusterMapObject();
                PlanetClusterMapObj.importedAt.push(entry.name);
                PlanetClusterMapObj.planetsByOriginalName = originalNames;
                PlanetClusterMapObj.planetsByNewName = newNames;
                Graph.PlanetClusterMap.push(PlanetClusterMapObj)
            }
        }
    })

}