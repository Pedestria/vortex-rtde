import { VortexGraph } from "../Graph.js";
import * as fs from 'fs-extra'
import traverse from '@babel/traverse'
import Module, { ModuleTypes } from "../Module.js";
//import Dependency from "../Dependency.js";
import EsModuleDependency from '../dependencies/EsModuleDependency'
//import { minifyIfProduction } from "../GraphGenerator.js";
import { Transport } from "../Transport.js";
import MDImportLocation from "../importlocations/MDImportLocation.js";
import { QueueEntry } from "../GraphGenerator.js";
import { resolveDependencyType, notNativeDependency, resolveNonNativeDependency } from "../DependencyFactory.js";
import { FileImportLocation } from "../importlocations/FileImportLocation.js";
import {isJs, LocalizedResolve} from '../Resolve'
import {ControlPanel} from '../types/ControlPanel'
import { ASTQueue, GrapherResult } from "../API.js";
import { ParseResult } from "@babel/core";
import { ImportDeclaration } from "@babel/types";

/**Searchs and Graphs JS code for ECMAScript Module Dependencies
 * 
 * @param {QueueEntry} entry 
 * @param {VortexGraph} Graph 
 */


export function SearchAndGraphImportDecl(entry:QueueEntry,node:babel.types.ImportDeclaration,Graph:VortexGraph,planetName:string,ControlPanel:ControlPanel,ASTQueue:ASTQueue){

            if(isJs(node.source.value,ControlPanel)){
                let modules = []
                //console.log(node);
                for (let ImportType of node.specifiers){
                    if (ImportType.type === 'ImportDefaultSpecifier'){
                        let mod
                        mod= new Module(ImportType.local.name,ModuleTypes.EsDefaultModule)
                        // else{
                        //     mod = new Module(ImportType.local.name,ModuleTypes.CjsNamespaceProvider)
                        // }
                        modules.push(mod)
                    }
                    else if (ImportType.type === 'ImportSpecifier') {
                        let mod= new Module(ImportType.local.name,ModuleTypes.EsModule)
                        modules.push(mod)
                    }
                    else {
                        let mod = new Module(ImportType.local.name,ModuleTypes.EsNamespaceProvider)
                        modules.push(mod)
                    }
                }
                //console.log(modules)
                let currentImpLoc = new MDImportLocation(entry.name,node.loc.start.line,modules,node.source.value)

                let name = node.source.value

                //If the Module dependency is NOT Built in to Vortex.

                if(notNativeDependency(name,ControlPanel)){
                    Transport(resolveNonNativeDependency(LocalizedResolve(entry.name,name),currentImpLoc,ControlPanel),
                    Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
                } 
                else {
                    let dep = new EsModuleDependency(name,currentImpLoc)
                    if(node.trailingComments !== undefined){
                        if(node.trailingComments[0].value === 'vortexRetain'){
                            dep.outBundle = true
                        }
                    }

                    //Browser Externals!
                    if(ControlPanel.externalLibs.includes(dep.name)){
                        dep.outBundle = true
                        dep.libLoc = dep.name
                    }
                    Transport(dep,Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
            }

        } else{
            //For Non-Module Dependencies.
            let impLoc = new FileImportLocation(entry.name,node.loc.start.line,node.source.value,node.specifiers[0] !== undefined? node.specifiers[0].local.name : null);

            if(notNativeDependency(node.source.value,ControlPanel)){
                Transport(resolveNonNativeDependency(LocalizedResolve(entry.name,node.source.value),
                impLoc,ControlPanel),Graph,entry.name,null,planetName,ControlPanel,ASTQueue)
            } 
            
            let dep = resolveDependencyType(node.source.value,impLoc,entry.name)
            Transport(dep,Graph,entry.name,null,planetName,ControlPanel,ASTQueue);
        }

}