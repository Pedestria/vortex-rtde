import Dependency from "./Dependency.js";
import { VortexGraph } from "./Graph.js";
import { LocalizedResolve, addJsExtensionIfNecessary, resolveLibBundle } from "./Resolve.js";
import ModuleDependency from "./dependencies/ModuleDependency.js";
import EsModuleDependency from "./dependencies/EsModuleDependency.js";
import CjsModuleDependency from "./dependencies/CjsModuleDependency.js";
import ImportLocation from "./ImportLocation.js";
import MDImportLocation from "./MDImportLocation.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import { isInQueue, loadEntryFromQueue, addEntryToQueue, QueueEntry } from "./GraphGenerator.js";
//import MDImportLocation from "./MDImportLocation.js";
//
//Transports Dependencies into the Graph
//

export function Transport(Dependency:Dependency,Graph:VortexGraph,CurrentFile:string,CurrentMDImpLoc:MDImportLocation){

    let str = './'

    if (Dependency.name.includes(str)){
        //If local file, then resolve it to root dir.
        Dependency.updateName(LocalizedResolve(CurrentFile,addJsExtensionIfNecessary(Dependency.name)))
        if(Dependency instanceof EsModuleDependency || Dependency instanceof CjsModuleDependency){
            if(isInQueue(Dependency.name)){
                Dependency.verifyImportedModules(loadEntryFromQueue(Dependency.name),CurrentMDImpLoc)
            }
            else{
                addEntryToQueue(new QueueEntry(Dependency.name,Babel.parse(fs.readFileSync(Dependency.name).toString(),{"sourceType":'module'})))
                Dependency.verifyImportedModules(loadEntryFromQueue(Dependency.name),CurrentMDImpLoc)
            }
        }
    }
    else{
        // Else Find library bundle location
        if(Dependency instanceof ModuleDependency){
            Dependency.libLoc = resolveLibBundle(Dependency.name)
        }
    }

    if (Graph.searchFor(Dependency)){
        Graph.update(Dependency)
    }
    else{
        Graph.add(Dependency);
    }
}