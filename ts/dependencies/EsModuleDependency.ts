import Dependency from "../Dependency.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from '../Module'
import chalk = require("chalk");
import ModuleDependency from "./ModuleDependency.js";
import MDImportLocation from "../MDImportLocation.js";

export default class EsModuleDependency extends ModuleDependency {
    constructor(name:string,initImportLocation?:MDImportLocation){
        super(name,initImportLocation)
    }

    verifyImportedModules(file:string,currentImpLoc:MDImportLocation){

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
                    modBuffer.push(new Module(modid,ModuleTypes.EsDefaultOrNamespaceModule))
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

        let dummyImpLoc = new MDImportLocation('buffer',0,modBuffer)

        //let confModImp = []
        //let confModExp = []

        //let index = this.indexOfImportLocation(file)


        //console.log(confModExp,confModImp)

        let NonExtError = new Error(chalk.bgRed('Non Existant Modules Imported from ' + file))

        for(let mod of currentImpLoc.modules){
            if(dummyImpLoc.testForModule(mod) == false){
                throw NonExtError
            }
        }
    }
}