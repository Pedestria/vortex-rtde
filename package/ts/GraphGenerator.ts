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
import {transformAsync} from '@babel/core'
import { CSSDependency } from './dependencies/CSSDependency.js'
import * as css from 'css'
import * as CSSGrapher from './graphers/CSSGrapher'
import * as PlanetGrapher from './graphers/PlanetGrapher'
import {readFile} from 'fs/promises'
import { ControlPanel } from './Main.js'
import * as path from 'path'
import { notNativeDependency, resolveGrapherForNonNativeDependency } from './DependencyFactory.js'

var readFileAsync = readFile

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
    external?:boolean = false

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

export async function GenerateGraph(entry:string,modEntry:string){

    //let resolvedEntry = path.resolve(entry)

    let Graph = new VortexGraph(entry)

    Graph.shuttleEntry = modEntry;
    
    let loadedFilesCache:Array<string> = []

    let modEnt = addJsExtensionIfNecessary(entry)

    var entryFile = (await readFileAsync(modEnt)).toString()

    if(!ControlPanel.isLibrary){
        entryFile = (await transformAsync(entryFile.toString(),BabelSettings)).code
    }

    if(ControlPanel.polyfillPromise){
         entryFile = "import promisePolyfill from 'es6-promise' \n promisePolyfill.polyfill() \n" + entryFile
    }

    let entryAst = Babel.parse(entryFile.toString(),ParseSettings)


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
                        let file = (await readFileAsync(modEntry)).toString()

                        if(!ControlPanel.isLibrary){
                            file = (await transformAsync(file.toString(),BabelSettings)).code
                        }

                        let entryAst = Babel.parse(file.toString(),ParseSettings)

                        let ent = new QueueEntry(modName,entryAst)
                        addEntryToQueue(ent)
                        GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name),Graph)
                    }

                    loadedFilesCache.push(modName)
                }
                else{
                        if(dep instanceof ModuleDependency){
                            if(!ControlPanel.isLibrary){
                                if(isInQueue(dep.libLoc)){
                                    GraphDepsAndModsForCurrentFile(loadEntryFromQueue(dep.libLoc),Graph);
                                }
                                else{
                                    let ent = new QueueEntry(dep.libLoc,Babel.parse((await readFileAsync(dep.libLoc)).toString(),ParseSettings))
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
                    let sheet = css.parse((await readFileAsync(dep.name)).toString(),{source:dep.name})
                    let entry = new QueueEntry(dep.name,sheet)
                    addEntryToQueue(entry)
                    CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast,dep)
                }
            }
            // IF dependency is added from Addon
        } else if(notNativeDependency(dep.name)){
            resolveGrapherForNonNativeDependency(dep)(dep,Graph);
        }
    }


    //Planet Graph
    for(let planet of Graph.Planets){

        let modEnt = addJsExtensionIfNecessary(planet.entryModule)

        let entryFile = (await readFileAsync(modEnt)).toString()

        if(!ControlPanel.isLibrary && !planet.entryModuleIsLibrary){
            entryFile = (await transformAsync(entryFile.toString(),BabelSettings)).code
        }

        let entryAst = Babel.parse(entryFile.toString(),ParseSettings)

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
                            let file = (await readFileAsync(modName)).toString()

                              if(!ControlPanel.isLibrary){
                                  file = (await transformAsync(file.toString(),BabelSettings)).code
                              }
      
                              let entryAst = Babel.parse(file.toString(),ParseSettings)
      
                              let ent = new QueueEntry(modName,entryAst)
                              addEntryToQueue(ent)
                              GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name),Graph,planet.name)
                          }
      
                          loadedFilesCache.push(modName)
                      }
                      else{
                              if(dep instanceof ModuleDependency){
                                  if(!ControlPanel.isLibrary){
                                      if(isInQueue(dep.libLoc)){
                                          GraphDepsAndModsForCurrentFile(loadEntryFromQueue(dep.libLoc),Graph,planet.name);
                                      }
                                      else{
                                          let ent = new QueueEntry(dep.libLoc,Babel.parse((await readFileAsync(dep.libLoc)).toString(),ParseSettings))
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
                          let sheet = css.parse((await readFileAsync(dep.name)).toString(),{source:dep.name})
                          let entry = new QueueEntry(dep.name,sheet)
                          addEntryToQueue(entry)
                          CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast,dep)
                      }
                  }
                  // IF dependency is added from Addon
              } else if(notNativeDependency(dep.name)){
                resolveGrapherForNonNativeDependency(dep)(dep,Graph,planet.name);
            }
        }
    }

   return Graph
}

export function GraphDepsAndModsForCurrentFile(entry:QueueEntry,Graph:VortexGraph,planetName?:string){
    EsModuleGrapher.SearchAndGraph(entry,Graph,planetName)
    CjsModuleGrapher.SearchAndGraph(entry,Graph,planetName)
    PlanetGrapher.SearchAndGraph(entry,Graph)
}

// function GraphDepsForLib(dep:Dependency,Graph:VortexGraph){
//     if(dep instanceof ModuleDependency){
//         GraphDepsAndModsForCurrentFile(resolveLibBundle(dep.name),Graph)
//     }
// }



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