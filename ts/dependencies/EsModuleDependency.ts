import Dependency from "../Dependency.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from '../Module'
import chalk = require("chalk");
import ModuleDependency from "./ModuleDependency.js";
import MDImportLocation from "../MDImportLocation.js";
import { traverse } from "@babel/core";

export default class EsModuleDependency extends ModuleDependency {
    constructor(name:string,initImportLocation?:MDImportLocation){
        super(name,initImportLocation)
    }

    verifyImportedModules(dep:EsModuleDependency,currentImpLoc:MDImportLocation){

        const buffer = fs.readFileSync(dep.name,'utf-8').toString();

        const jsCode = Babel.parse(buffer,{"sourceType":"module"})

        let modBuffer:Array<Module> = []

        //let VDefImport = new RegExp('_VDefaultImport_')
        //let VNamImport = new RegExp('_VNamedImport_')
        //let VDefExport = new RegExp('_VDefaultExport_')
        //let VNamExport = new RegExp('_VNamedExport_')

        traverse(jsCode, {
            ExportDefaultDeclaration : function(path){
                    let defaultMod = path.node.declaration
                    let modid =  defaultMod.id.name
                    modBuffer.push(new Module(modid,ModuleTypes.EsDefaultOrNamespaceModule))
                },
            ExportNamedDeclaration : function(path){
                    for (let ExportType of path.node.specifiers){
                        if (ExportType.type === 'ExportSpecifier'){
                            let mod = ExportType.exported.name
                            modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                        }
                    }
                    let mod = path.node.declaration.id.name
                    modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                }
            })

        let dummyImpLoc = new MDImportLocation('buffer',0,modBuffer)

        //let confModImp = []
        //let confModExp = []

        //let index = this.indexOfImportLocation(file)


        //console.log(confModExp,confModImp)

        let NonExtError = new Error(chalk.redBright('Non Existent Modules Imported from ' + dep.name))

        for(let mod of currentImpLoc.modules){
            if(dummyImpLoc.testForModule(mod) == false){
                throw NonExtError
            }
        }
    }
}