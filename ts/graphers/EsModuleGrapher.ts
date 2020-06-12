import { VortexGraph } from "../Graph.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from "../Module.js";
//import Dependency from "../Dependency.js";
import EsModuleDependency from '../dependencies/EsModuleDependency'
import chalk = require("chalk");
import path = require('path')
import { LocalizedResolve } from "../Resolve.js";

export function SearchAndGraph(file:string,Graph:VortexGraph){

    const buffer = fs.readFileSync(file,'utf-8').toString();

    let regexp = new RegExp('./')

    const jsCode = Babel.parse(buffer,{"sourceType":"module"}).program.body


    for (let node of jsCode){
        //console.log(node);
        if (node.type === 'ImportDeclaration'){
            let modules = []
            //console.log(node);
            for (let ImportType of node.specifiers){
                if (ImportType.type === 'ImportDefaultSpecifier'){
                    let mod= new Module(ImportType.local.name,ModuleTypes.EsDefaultModule)
                    modules.push(mod)
                }
                else if (ImportType.type === 'ImportSpecifier') {
                    let mod= new Module(ImportType.local.name,ModuleTypes.EsModule)
                    modules.push(mod)
                }
            }
            let depName = LocalizedResolve(file,node.source.value)
            if(node.source.value.match(regexp) == null){
                depName = node.source.value
            }
            let dep = new EsModuleDependency(depName,modules,file)
            let filename = node.source.value

            if (node.source.value.match(regexp) !== null){
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
}