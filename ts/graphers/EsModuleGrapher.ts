import { VortexGraph } from "../Graph.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import traverse from '@babel/traverse'
import Module, { ModuleTypes } from "../Module.js";
//import Dependency from "../Dependency.js";
import EsModuleDependency from '../dependencies/EsModuleDependency'
import chalk = require("chalk");
import path = require('path')
import { LocalizedResolve, addJsExtensionIfNecessary } from "../Resolve.js";

export function SearchAndGraph(file:string,Graph:VortexGraph){

    const buffer = fs.readFileSync(file,'utf-8').toString();

    let str =  './'

    const jsCode = Babel.parse(buffer,{"sourceType":"module"})

    traverse(jsCode,{
        enter(path) {
            if (path.node.type === 'ImportDeclaration'){
                let modules = []
                //console.log(path.node);
                for (let ImportType of path.node.specifiers){
                    if (ImportType.type === 'ImportDefaultSpecifier'){
                        let mod= new Module(ImportType.local.name,ModuleTypes.EsDefaultModule)
                        modules.push(mod)
                    }
                    else if (ImportType.type === 'ImportSpecifier') {
                        let mod= new Module(ImportType.local.name,ModuleTypes.EsModule)
                        modules.push(mod)
                    }
                }
                let depName = LocalizedResolve(file,path.node.source.value)
                if(path.node.source.value.includes(str) == false){
                    depName = path.node.source.value
                }
                let dep = new EsModuleDependency(depName,modules,file)
                let filename = addJsExtensionIfNecessary(path.node.source.value)
    
                if (path.node.source.value.includes(str) == true){
                    dep.verifyImportedModules(LocalizedResolve(file,filename))
                }
    
                if (Graph.searchFor(dep)){
                    Graph.update(dep)
                }
                else{
                    Graph.add(dep);
                }
            }

        }
    })
}