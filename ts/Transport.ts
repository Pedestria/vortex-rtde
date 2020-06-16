import Dependency from "./Dependency.js";
import { VortexGraph } from "./Graph.js";
import { LocalizedResolve, addJsExtensionIfNecessary, resolveLibBundle } from "./Resolve.js";
import ModuleDependency from "./dependencies/ModuleDependency.js";
import EsModuleDependency from "./dependencies/EsModuleDependency.js";
import CjsModuleDependency from "./dependencies/CjsModuleDependency.js";
import ImportLocation from "./ImportLocation.js";
import MDImportLocation from "./MDImportLocation.js";
//import MDImportLocation from "./MDImportLocation.js";
//
//Transports Dependencies into the Graph
//

export function Transport(Dependency:Dependency,Graph:VortexGraph,CurrentFile:string,CurrentMDImpLoc:MDImportLocation){

    let str = './'

    if (Dependency.name.includes(str)){
        Dependency.updateName(LocalizedResolve(CurrentFile,addJsExtensionIfNecessary(Dependency.name)))
        if(Dependency instanceof EsModuleDependency || Dependency instanceof CjsModuleDependency){
            Dependency.verifyImportedModules(Dependency.name,CurrentMDImpLoc)
        }
    }
    else{
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