import * as fs from 'fs-extra'
import { VortexGraph } from './Graph.js'
import * as EsModuleGrapher from './graphers/EsModuleGrapher'
import * as CjsModuleGrapher from './graphers/CommonJsModuleGrapher'
import * as t from '@babel/types'
import {addJsExtensionIfNecessary, resolveLibBundle } from './Resolve.js'
import * as Babel from '@babel/parser'
import Dependency from './Dependency.js'
import ModuleDependency from './dependencies/ModuleDependency.js'
import {BabelSettings, ParseSettings } from './Options.js'
import {isProduction, isLibrary, polyfillPromise} from './Main'
import { transform, transformSync, transformFileSync } from '@babel/core'
import { CSSDependency } from './dependencies/CSSDependency.js'
import * as css from 'css'
import * as CSSGrapher from './graphers/CSSGrapher'
import * as PlanetGrapher from './graphers/PlanetGrapher'
//import * as terser from 'terser'

export var queue:Array<QueueEntry> = []

export function isInQueue(entryName:string){
    for(let ent of queue){
        if(ent.name === entryName){
            return true
        }
    }
    return false
}

export function addEntryToQueue(entry:QueueEntry){
    queue.push(entry)
}

export function loadEntryFromQueue(entryName:string){
    for(let ent of queue){
        if(ent.name === entryName){
            return ent
        }
    }
}

export class QueueEntry {
    name:string
    ast:t.File|css.Stylesheet
    constructor(name:string,parsedCode:t.File|css.Stylesheet){
        this.name = name
        this.ast = parsedCode
    }

}

/**
 * Generates a Vortex Graph of your app/library.
 * @param {string} entry Entry point for GraphGenerator
 * @returns {VortexGraph} A Dependency Graph
 * 
 */

export default async function GenerateGraph(entry:string,modEntry:string): Promise<VortexGraph> {

    const node_modules:string = 'node_modules'

    //let resolvedEntry = path.resolve(entry)

    let Graph = new VortexGraph(entry)

    Graph.shuttleEntry = modEntry;
    
    let loadedFilesCache:Array<string> = []

    let modEnt = addJsExtensionIfNecessary(entry)

    let entryFile = fs.readFileSync(modEnt).toString()

    if(!isLibrary){
        entryFile = transformSync(fs.readFileSync(modEnt).toString(),BabelSettings).code
    }

    if(polyfillPromise){
        
    }

    let entryAst = Babel.parse(entryFile,ParseSettings)


    addEntryToQueue(new QueueEntry(entry,entryAst))
    GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modEnt),Graph);
    loadedFilesCache.push(entry)

    //Star Graph
    
    for (let dep of Graph.Star){
      if(dep instanceof ModuleDependency){
          if(dep.outBundle !== true){
            let str = './'
            if (loadedFilesCache.includes(dep.name) == false){
                if (dep.name.includes(str) == true) {
                    let modName = addJsExtensionIfNecessary(dep.name)
                    if(isInQueue(modName)){
                        GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modName),Graph)
                    }
                    else{
                        let file = fs.readFileSync(modName).toString()

                        if(!isLibrary){
                            file = transformSync(file,BabelSettings).code
                        }

                        let entryAst = Babel.parse(file,ParseSettings)

                        let ent = new QueueEntry(modName,entryAst)
                        addEntryToQueue(ent)
                        GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name),Graph)
                    }

                    loadedFilesCache.push(modName)
                }
                else{
                        if(dep instanceof ModuleDependency){
                            if(!isLibrary){
                                if(isInQueue(dep.libLoc)){
                                    GraphDepsAndModsForCurrentFile(dep.libLoc);
                                }
                                else{
                                    let ent = new QueueEntry(dep.libLoc,Babel.parse(fs.readFileSync(dep.libLoc).toString(),ParseSettings))
                                    addEntryToQueue(ent)
                                    GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name),Graph)
                                    
                                }
                            }
                            loadedFilesCache.push(dep.name)
                        }
                    }
                }
            }
        } else if(dep instanceof CSSDependency){
            if(loadedFilesCache.includes(dep.name) == false){
                if(isInQueue(dep.name)){
                    CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast,dep)
                }
                else{
                    let sheet = css.parse(fs.readFileSync(dep.name).toString(),{source:dep.name})
                    let entry = new QueueEntry(dep.name,sheet)
                    addEntryToQueue(entry)
                    CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast,dep)
                }
            }
        }
    }


    //Planet Graph
    for(let planet of Graph.Planets){

        let modEnt = addJsExtensionIfNecessary(planet.entryModule)

        let entryFile = fs.readFileSync(modEnt).toString()

        if(!isLibrary){
            entryFile = transformSync(fs.readFileSync(modEnt).toString(),BabelSettings).code
        }

        let entryAst = Babel.parse(entryFile,ParseSettings)

        addEntryToQueue(new QueueEntry(planet.entryModule,entryAst))
        GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modEnt),Graph,planet.name);
        loadedFilesCache.push(entry)

        for(let dep of planet.modules){
            if(dep instanceof ModuleDependency){
                if(dep.outBundle !== true){
                  let str = './'
                  if (loadedFilesCache.includes(dep.name) == false){
                      if (dep.name.includes(str) == true) {
                          let modName = addJsExtensionIfNecessary(dep.name)
                          if(isInQueue(modName)){
                              GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modName),Graph,planet.name)
                          }
                          else{
                              let file = fs.readFileSync(modName).toString()
      
                              if(!isLibrary){
                                  file = transformSync(file,BabelSettings).code
                              }
      
                              let entryAst = Babel.parse(file,ParseSettings)
      
                              let ent = new QueueEntry(modName,entryAst)
                              addEntryToQueue(ent)
                              GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name),Graph,planet.name)
                          }
      
                          loadedFilesCache.push(modName)
                      }
                      else{
                              if(dep instanceof ModuleDependency){
                                  if(!isLibrary){
                                      if(isInQueue(dep.libLoc)){
                                          GraphDepsAndModsForCurrentFile(dep.libLoc,Graph,planet.name);
                                      }
                                      else{
                                          let ent = new QueueEntry(dep.libLoc,Babel.parse(fs.readFileSync(dep.libLoc).toString(),ParseSettings))
                                          addEntryToQueue(ent)
                                          GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name),Graph,planet.name)
                                          
                                      }
                                  }
                                  loadedFilesCache.push(dep.name)
                              }
                          }
                      }
                  }
              } else if(dep instanceof CSSDependency){
                  if(loadedFilesCache.includes(dep.name) == false){
                      if(isInQueue(dep.name)){
                          CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast,dep)
                      }
                      else{
                          let sheet = css.parse(fs.readFileSync(dep.name).toString(),{source:dep.name})
                          let entry = new QueueEntry(dep.name,sheet)
                          addEntryToQueue(entry)
                          CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast,dep)
                      }
                  }
              }
        }
    }


    return Graph
}

function GraphDepsAndModsForCurrentFile(entry:QueueEntry,Graph:VortexGraph,planetName?:string){
    EsModuleGrapher.SearchAndGraph(entry,Graph,planetName)
    CjsModuleGrapher.SearchAndGraph(entry,Graph,planetName)
    PlanetGrapher.SearchAndGraph(entry,Graph)
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