import { VortexGraph } from "../Graph.js";
import * as fs from 'fs-extra'
import traverse from '@babel/traverse'
import Module, { ModuleTypes } from "../Module.js";
//import Dependency from "../Dependency.js";
import EsModuleDependency from '../dependencies/EsModuleDependency'
//import { minifyIfProduction } from "../GraphGenerator.js";
import { Transport } from "../Transport.js";
import MDImportLocation from "../MDImportLocation.js";
import { QueueEntry } from "../GraphGenerator.js";
import { exportDefaultSpecifier } from "@babel/types";
import { resolveDependencyType } from "../DependencyFactory.js";
import ImportLocation from "../ImportLocation.js";
import { isJs } from "../Main.js";
import { strict } from "assert";
import { FileImportLocation } from "../FIleImportLocation.js";

/**Searchs and Graphs JS code for ECMAScript Module Dependencies
 * 
 * @param {QueueEntry} entry 
 * @param {VortexGraph} Graph 
 */


export function SearchAndGraph(entry:QueueEntry,Graph:VortexGraph){

    traverse(entry.ast,{
        ImportDeclaration: function(path) {
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
                Transport(new EsModuleDependency(path.node.source.value,currentImpLoc),Graph,entry.name,currentImpLoc)

        } else{
            //For Non-Module Dependencies.
            let impLoc = new FileImportLocation(entry.name,path.node.loc.start.line,path.node.source.value,path.node.specifiers[0] !== undefined? path.node.specifiers[0].local.name : null);
            let dep = resolveDependencyType(path.node.source.value,impLoc,entry.name)
            Transport(dep,Graph,entry.name)
        }
    }
    })
}