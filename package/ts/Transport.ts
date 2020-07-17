import Dependency from "./Dependency.js";
import { VortexGraph } from "./Graph.js";
import { LocalizedResolve, addJsExtensionIfNecessary, resolveLibBundle } from "./Resolve.js";
import ModuleDependency from "./dependencies/ModuleDependency.js";
import EsModuleDependency from "./dependencies/EsModuleDependency.js";
import CjsModuleDependency from "./dependencies/CjsModuleDependency.js";
import MDImportLocation from "./importlocations/MDImportLocation.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import { isInQueue, loadEntryFromQueue, addEntryToQueue, QueueEntry } from "./GraphGenerator.js";
import {ControlPanel} from "./Main.js";
import {transformSync} from "@babel/core";
import { BabelSettings } from "./Options.js";
import { ModuleTypes } from "./Module.js";
import { searchForDefaultNamespace } from "./dependencies/NamespaceSearch.js";
//import MDImportLocation from "./MDImportLocation.js";

/**Transports the given dependency to given Graph.
 * 
 * @param {Dependency} Dependency Dependency to Transport
 * @param {VortexGraph} Graph Graph to Use
 * @param {string} CurrentFile Current file being loading from. 
 * @param {MDImportLocation} CurrentMDImpLoc Curret Module Dependency Import Location
 */
export function Transport(Dependency:Dependency,Graph:VortexGraph,CurrentFile:string,CurrentMDImpLoc?:MDImportLocation,planetName?:string){

    verifyModules(Dependency,CurrentFile,CurrentMDImpLoc);

    //If transporting to Star 
    if(planetName === undefined){
        if (Graph.searchFor(Dependency)){
            Graph.update(Dependency)
        }
        else{
            Graph.add(Dependency);
        }
        //Else transport to planet if currently graphing for one.
    } else{
        if(Graph.searchForOnPlanet(Dependency,planetName)){
            Graph.updateOnPlanet(Dependency,planetName);
        }
        else{
            Graph.addToPlanet(Dependency,planetName);
        }
    }

    return;
}

function verifyModules(Dependency:Dependency,CurrentFile:string,CurrentMDImpLoc?:MDImportLocation){

    let str = './'

    if(Dependency instanceof ModuleDependency){
        if(Dependency.outBundle !== true){
            if (Dependency.name.includes(str)){
                //If local file, then resolve it to root dir.
                Dependency.updateName(LocalizedResolve(CurrentFile,addJsExtensionIfNecessary(Dependency.name)))
                    if(Dependency instanceof EsModuleDependency || Dependency instanceof CjsModuleDependency){
                        if(isInQueue(Dependency.name)){
                            if(CurrentMDImpLoc.modules.length > 0){
                                Dependency.verifyImportedModules(loadEntryFromQueue(Dependency.name),CurrentMDImpLoc)
                            }
                        }
                        else{
                            let file = fs.readFileSync(Dependency.name).toString()
                            if(!ControlPanel.isLibrary){
                                file = transformSync(file,BabelSettings).code
                            }
                            addEntryToQueue(new QueueEntry(Dependency.name,Babel.parse(file,{"sourceType":'module'})))
                            if(CurrentMDImpLoc.modules.length > 0){
                                Dependency.verifyImportedModules(loadEntryFromQueue(Dependency.name),CurrentMDImpLoc)
                            }
                        }
                    }
            }
            else{
                // Else Find library bundle location
                if(Dependency instanceof ModuleDependency){
                    Dependency.libLoc = resolveLibBundle(Dependency.name)
                    if(CurrentMDImpLoc.modules[0] !== undefined){
                        if(Dependency instanceof EsModuleDependency && CurrentMDImpLoc.modules[0].type === ModuleTypes.EsDefaultModule){
                            if(searchForDefaultNamespace(Dependency.libLoc,CurrentMDImpLoc.modules[0].name)){
                                CurrentMDImpLoc.modules[0].type = ModuleTypes.EsDefaultNamespaceProvider
                                // console.log(CurrentMDImpLoc.modules[0].name)
                            }
                        }
                    }
                }
            } 
        }
    }

}