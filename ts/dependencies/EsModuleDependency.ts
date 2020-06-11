import Dependency from "../Dependency.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from '../Module'
import chalk = require("chalk");
import ModuleDependency from "./ModuleDependency.js";

export default class EsModuleDependency extends ModuleDependency {
    constructor(name:string,acquiredModules:Array<Module>,initSuperDependency?:string){
        super(name,acquiredModules,initSuperDependency)
    }

    verifyImportedModules(file:string){

        const buffer = fs.readFileSync(file,'utf-8').toString();

        const jsCode = Babel.parse(buffer,{"sourceType":"module"}).program.body

        let modBuffer = []

        //let VDefImport = new RegExp('_VDefaultImport_')
        //let VNamImport = new RegExp('_VNamedImport_')
        //let VDefExport = new RegExp('_VDefaultExport_')
        //let VNamExport = new RegExp('_VNamedExport_')

            for (let node of jsCode){
                //console.log(node)
                if (node.type === 'ExportDefaultDeclaration'){
                    //console.log(node)
                    let defaultMod = node.declaration
                    let modid =  defaultMod.id.name
                    modBuffer.push(new Module(modid,ModuleTypes.EsDefaultModule))
                }
                if (node.type == 'ExportNamedDeclaration'){
                    //console.log(node)
                    for (let ExportType of node.specifiers){
                        if (ExportType.type === 'ExportSpecifier'){
                            let mod = ExportType.exported.name
                            modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                        }
                    }
                    let mod = node.declaration.id.name
                    modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                }
        }

        let testDep = new ModuleDependency('buffer',modBuffer)

        //let confModImp = []
        //let confModExp = []


        //console.log(confModExp,confModImp)

        let NonExtError = new Error(chalk.bgRed('Non Existant Modules Imported from ' + file))

        for(let mod of this.acquiredModules){
            if(testDep.testForModule(mod) == false){
                throw NonExtError
            }
        }
    }
}