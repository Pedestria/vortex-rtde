import Dependency from "./Dependency.js";
import { VortexGraph } from "./Graph.js";
import { LocalizedResolve, addJsExtensionIfNecessary, resolveLibBundle } from "./Resolve.js";
import ModuleDependency from "./dependencies/ModuleDependency.js";
import EsModuleDependency from "./dependencies/EsModuleDependency.js";
import CjsModuleDependency from "./dependencies/CjsModuleDependency.js";
import MDImportLocation from "./importlocations/MDImportLocation.js";
import * as Babel from '@babel/parser'
import {readFileSync} from 'fs-extra'
import {transformSync} from "@babel/core";
import { BabelSettings } from "./Options.js";
import { ModuleTypes } from "./Module.js";
import { searchForDefaultNamespace } from "./dependencies/NamespaceSearch.js";
import { VTXPanel } from "./API.js";
//import MDImportLocation from "./MDImportLocation.js";

/**Transports the given dependency to given Graph.
 * 
 * @param {Dependency} Dependency Dependency to Transport
 * @param {VortexGraph} Graph Graph to Use
 * @param {string} CurrentFile Current file being loading from. 
 * @param {MDImportLocation} CurrentMDImpLoc Curret Module Dependency Import Location
 */
export function Transport(Dependency:Dependency,Graph:VortexGraph,CurrentFile:string,CurrentMDImpLoc?:MDImportLocation,planetName?:string,ControlPanel,ASTQueue){

    verifyModules(Dependency,CurrentFile,CurrentMDImpLoc,ControlPanel,ASTQueue);

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
}

function verifyModules(Dependency:Dependency,CurrentFile:string,CurrentMDImpLoc?:MDImportLocation,ControlPanel: VTXPanel,ASTQueue:ASTQueue){

    let str = './'

    if(Dependency instanceof ModuleDependency){
        if(Dependency.outBundle !== true){
            if (Dependency.name.includes(str)){
                //If local file, then resolve it to root dir.
                Dependency.updateName(LocalizedResolve(CurrentFile,addJsExtensionIfNecessary(Dependency.name)))
                    if(Dependency instanceof EsModuleDependency || Dependency instanceof CjsModuleDependency){
                        if(ASTQueue.isInQueue(Dependency.name)){
                            if(CurrentMDImpLoc.modules.length > 0){
                                Dependency.verifyImportedModules(ASTQueue.loadEntryFromQueue(Dependency.name),CurrentMDImpLoc)
                            }
                        }
                        else{
                            let file = readFileSync(Dependency.name).toString()
                            if(!ControlPanel.isLibrary){
                                file = transformSync(file,BabelSettings).code
                            }
                            ASTQueue.addEntryToQueue(new ASTQueue.QueueEntry(Dependency.name,Babel.parse(file,{"sourceType":'module'})))
                            if(CurrentMDImpLoc.modules.length > 0){
                                Dependency.verifyImportedModules(ASTQueue.loadEntryFromQueue(Dependency.name),CurrentMDImpLoc)
                            }
                        }
                    }
            }
            else if(!ControlPanel.isLibrary){
                // Else Find library bundle location
                if(Dependency instanceof ModuleDependency){
                    Dependency.libLoc = resolveLibBundle(Dependency.name,ControlPanel)
                    if(CurrentMDImpLoc.modules[0] !== undefined){
                        if(Dependency instanceof EsModuleDependency && CurrentMDImpLoc.modules[0].type === ModuleTypes.EsDefaultModule){
                            if(searchForDefaultNamespace(Dependency.libLoc,CurrentMDImpLoc.modules[0].name,ControlPanel)){
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