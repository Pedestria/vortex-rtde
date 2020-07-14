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
import { exportDefaultSpecifier } from "@babel/types";
import { resolveDependencyType, getFileExtension, notNativeDependency, resolveNonNativeDependency } from "../DependencyFactory.js";
import ImportLocation from "../ImportLocation.js";
import {ControlPanel} from "../Main.js";
import { FileImportLocation } from "../importlocations/FileImportLocation.js";
import {isJs, LocalizedResolve} from '../Resolve'
import * as PATH from 'path'

/**Searchs and Graphs JS code for ECMAScript Module Dependencies
 * 
 * @param {QueueEntry} entry 
 * @param {VortexGraph} Graph 
 */


export function SearchAndGraph(entry:QueueEntry,Graph:VortexGraph,planetName?:string){

    traverse(entry.ast,{
        ImportDeclaration:function(path) {
            if(isJs(path.node.source.value)){
                let modules = []
                //console.log(path.node);
                for (let ImportType of path.node.specifiers){
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
                let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,path.node.source.value)

                let name = path.node.source.value

                //If the Module dependency is NOT Built in to Vortex.

                if(notNativeDependency(name)){
                    Transport(resolveNonNativeDependency(LocalizedResolve(entry.name,name),currentImpLoc),Graph,entry.name,currentImpLoc,planetName)
                } 
                else {
                    let dep = new EsModuleDependency(name,currentImpLoc)
                    if(path.node.trailingComments !== undefined){
                        if(path.node.trailingComments[0].value === 'vortexRetain'){
                            dep.outBundle = true
                        }
                    }

                    //Browser Externals!
                    if(ControlPanel.externalLibs.includes(dep.name)){
                        dep.outBundle = true
                        dep.libLoc = dep.name
                    }
                    Transport(dep,Graph,entry.name,currentImpLoc,planetName)
            }

        } else{
            //For Non-Module Dependencies.
            let impLoc = new FileImportLocation(entry.name,path.node.loc.start.line,path.node.source.value,path.node.specifiers[0] !== undefined? path.node.specifiers[0].local.name : null);
            let dep = resolveDependencyType(path.node.source.value,impLoc,entry.name)
            Transport(dep,Graph,entry.name,null,planetName)
        }
    }
    })
}