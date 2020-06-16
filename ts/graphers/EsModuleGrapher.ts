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
//import { minifyIfProduction } from "../GraphGenerator.js";
import { Transport } from "../Transport.js";
import MDImportLocation from "../MDImportLocation.js";

export function SearchAndGraph(file:string,Graph:VortexGraph){

    const buffer = fs.readFileSync(file,'utf-8').toString();

    const jsCode = Babel.parse(buffer,{"sourceType":"module"})

    traverse(jsCode,{
        ImportDeclaration: function(path) {
                let modules = []
                //console.log(path.node);
                for (let ImportType of path.node.specifiers){
                    if (ImportType.type === 'ImportDefaultSpecifier'){
                        let mod= new Module(ImportType.local.name,ModuleTypes.EsDefaultOrNamespaceModule)
                        modules.push(mod)
                    }
                    else if (ImportType.type === 'ImportSpecifier') {
                        let mod= new Module(ImportType.local.name,ModuleTypes.EsModule)
                        modules.push(mod)
                    }
                }
                //console.log(modules)
                let currentImpLoc = new MDImportLocation(file,path.node.loc.start.line,modules)
                Transport(new EsModuleDependency(path.node.source.value,currentImpLoc),Graph,file,currentImpLoc)
        }
    })
}