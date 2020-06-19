import Dependency from "../Dependency.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from '../Module'
import * as chalk from 'chalk'
import ModuleDependency from "./ModuleDependency.js";
import MDImportLocation from "../MDImportLocation.js";
import traverse from "@babel/traverse";
import * as t from '@babel/types'
import { QueueEntry } from "../GraphGenerator.js";

export default class EsModuleDependency extends ModuleDependency {
    constructor(name:string,initImportLocation?:MDImportLocation){
        super(name,initImportLocation)
    }

    verifyImportedModules(entry:QueueEntry,currentImpLoc:MDImportLocation){

        let modBuffer:Array<Module> = []

        //let VDefImport = new RegExp('_VDefaultImport_')
        //let VNamImport = new RegExp('_VNamedImport_')
        //let VDefExport = new RegExp('_VDefaultExport_')
        //let VNamExport = new RegExp('_VNamedExport_')

        traverse(entry.ast, {
            ExportDefaultDeclaration : function(path) {
                    let defaultMod = path.node.declaration
                    let modid =  defaultMod.id.name
                    modBuffer.push(new Module(modid,ModuleTypes.EsDefaultModule))

                    if(path.node.declaration.type === 'ClassDeclaration'){
                        let mod = path.node.declaration.id.name
                        modBuffer.push(new Module(mod,ModuleTypes.EsDefaultModule))
                    }
                    if(path.node.declaration.type === 'FunctionDeclaration'){
                        let mod = path.node.declaration.id.name
                        modBuffer.push(new Module(mod,ModuleTypes.EsDefaultModule))
                    }

                },
            ExportNamedDeclaration : function(path){
                if(path.node.declaration.type === 'VariableDeclaration'){
                    let mod = path.node.declaration.declarations[0].id.name
                    modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                }
                else if(path.node.declaration.type === 'ClassDeclaration'){
                    let mod = path.node.declaration.id.name
                    modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                }
                else if(path.node.declaration.type === 'FunctionDeclaration'){
                    let mod = path.node.declaration.id.name
                    modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                }
                else{
                        for (let ExportType of path.node.specifiers){
                            if (ExportType.type === 'ExportSpecifier'){
                                let mod = ExportType.exported.name
                                modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                            }
                        }
                            
                        let mod = path.node.declaration.id.name
                        modBuffer.push(new Module(mod,ModuleTypes.EsModule))
                        }
                    }
                }
            )

        let dummyImpLoc = new MDImportLocation('buffer',0,modBuffer,'')

        //let confModImp = []
        //let confModExp = []

        //let index = this.indexOfImportLocation(file)

        //console.log(modBuffer)

        //console.log(currentImpLoc.modules)


        //console.log(confModExp,confModImp)

        let NonExtError = new Error(chalk.redBright('Non Existent Modules Imported from ' + entry.name))

        for(let mod of currentImpLoc.modules){
            if(dummyImpLoc.testForModule(mod) == false){
                for(let modName of findModulesUnderNamespace(currentImpLoc.name,mod.name)){
                     if(searchForModuleUnderNamespace(currentImpLoc.name,modName,mod.name) == false){
                         throw NonExtError
                     }
                }
                //currentImpLoc.modules[currentImpLoc.indexOfModuleByName(mod.name)].type = ModuleTypes.CjsNamespaceProvider
             }
         }
     }
 
 }
 
 function findModulesUnderNamespace(file:string,Namespace:string){
 
     const buffer = fs.readFileSync(file,'utf-8').toString();
 
     const jsCode = Babel.parse(buffer,{"sourceType":"module"})
 
     let modules:Array<string> = []
 
 
     traverse(jsCode,{
         MemberExpression : function (path){
                 if(path.node.object.type === 'Identifier'){
                     var namespace = path.node.object.name
                 }
                 if(path.node.property.type === 'Identifier'){
                     if(namespace == Namespace){
                         modules.push(path.node.property.name)
                     }
                 }
             }
         })
     return modules
 
 }
 
 function searchForModuleUnderNamespace(file:string,Module:string,Namespace:string):boolean{
 
     const buffer = fs.readFileSync(file,'utf-8').toString();
 
     const jsCode = Babel.parse(buffer,{"sourceType":"module"})
 
     let rc = false
 
     traverse(jsCode,{
         MemberExpression : function (path) {
                 if(path.node.object.type === 'Identifier'){
                     var namespace = path.node.object.name
                 }
                 if(path.node.property.type === 'Identifier'){
                     if(namespace == Namespace){
                         if(path.node.property.name === Module){
                             rc = true
                         }
                     }
                 }
             }
         })
     return rc
 }