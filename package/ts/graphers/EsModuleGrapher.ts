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

/**Searchs and Graphs JS code for ECMAScript Module Dependencies
 * 
 * @param {QueueEntry} entry 
 * @param {VortexGraph} Graph 
 */


export function SearchAndGraph(entry:QueueEntry,Graph:VortexGraph,planetName?:string,ControlPanel:ControlPanel,ASTQueue){

    traverse(entry.ast,{
        ImportDeclaration:function(path) {
            if(isJs(path.node.source.value,ControlPanel)){
                let modules = []
                //console.log(path.node);
                for (let ImportType of path.node.specifiers){
                    if (ImportType.type === 'ImportDefaultSpecifier'){
                        let mod
                        mod= new Module(ImportType.local.name,"EsDefaultModule")
                        // else{
                        //     mod = new Module(ImportType.local.name,ModuleTypes.CjsNamespaceProvider)
                        // }
                        modules.push(mod)
                    }
                    else if (ImportType.type === 'ImportSpecifier') {
                        let mod= new Module(ImportType.local.name,"EsModule")
                        modules.push(mod)
                    }
                    else {
                        let mod = new Module(ImportType.local.name,"EsNamespaceProvider")
                        modules.push(mod)
                    }
                }
                //console.log(modules)
                let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,path.node.source.value)

                let name = path.node.source.value

                //If the Module dependency is NOT Built in to Vortex.

                if(notNativeDependency(name,ControlPanel)){
                    Transport(resolveNonNativeDependency(LocalizedResolve(entry.name,name),currentImpLoc,ControlPanel),Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
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
                    Transport(dep,Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
            }

        } else{
            //For Non-Module Dependencies.
            let impLoc = new FileImportLocation(entry.name,path.node.loc.start.line,path.node.source.value,path.node.specifiers[0] !== undefined? path.node.specifiers[0].local.name : null);

            if(notNativeDependency(path.node.source.value,ControlPanel)){
                Transport(resolveNonNativeDependency(LocalizedResolve(entry.name,path.node.source.value),impLoc,ControlPanel),Graph,entry.name,null,planetName,ControlPanel,ASTQueue)
            } 
            
            let dep = resolveDependencyType(path.node.source.value,impLoc,entry.name)
            Transport(dep,Graph,entry.name,null,planetName,ControlPanel,ASTQueue);
        }
    }
    })
}