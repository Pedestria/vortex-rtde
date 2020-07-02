import ModuleDependency from "./ModuleDependency.js"
import Module, { ModuleTypes } from '../Module'
import chalk from 'chalk'
import MDImportLocation from "../MDImportLocation.js";
import traverse from "@babel/traverse";
import { QueueEntry } from "../GraphGenerator.js"
//import Dependency from "../Dependency.js";
import {findModulesUnderNamespace,searchForModuleUnderNamespace} from './NamespaceSearch'

/** CommonJS Dependency that contain exported Modules 
 * @extends ModuleDependency
 */
export default class CjsModuleDependency extends ModuleDependency{

    constructor(name:string,initImportLocation?:MDImportLocation) {
        super(name,initImportLocation);
    }

    verifyImportedModules(entry:QueueEntry,currentImpLoc:MDImportLocation){

        let modBuffer:Array<Module> = []

        //console.log("Calling" + file)

        traverse(entry.ast,{
            ExpressionStatement: function(path) {
                if(path.node.expression.type === 'AssignmentExpression'){
                    if(path.node.expression.left.type === 'MemberExpression'){
                        if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){
                            //console.log(path.node.expression.right)
                            if(path.node.expression.right.type === 'FunctionExpression' || path.node.expression.right.type === 'ArrowFunctionExpression'){
                                modBuffer.push(new Module('_DefaultFunction_',ModuleTypes.CjsDefaultFunction))
                            }
                            else{
                                modBuffer.push(new Module(path.node.expression.right.name,ModuleTypes.CjsModule))
                            }
                        } 
                        if(path.node.expression.left.object.name === 'exports'){
                           if(path.node.expression.left.property.name === 'default'){
                               if(path.node.expression.right.type !== 'UnaryExpression'){
                               modBuffer.push(new Module(path.node.expression.right.name,ModuleTypes.CjsDefaultModule))
                               }
                            }
                           else{
                                if(path.node.expression.right.type !== 'UnaryExpression'){
                                modBuffer.push(new Module(path.node.expression.right.name,ModuleTypes.CjsModule))
                                }
                           }
                        }
                    }
                }
            }
        })

        let dummyImpLoc = new MDImportLocation('buffer',0,modBuffer,'')
        //console.log(dummyImpLoc)

        // let confModImp = []
        // let confModExp = []

        //let index = this.indexOfImportLocation(file)


        // console.log(confModExp,confModImp)

        // console.log(this.acquiredModules)
        // console.log(modBuffer)

        //console.log(currentImpLoc)


        let NonExtError = new Error(chalk.redBright('Non Existant Modules Imported from ' + entry.name))

        for(let mod of currentImpLoc.modules){
            if(dummyImpLoc.testForModule(mod) == false){
               for(let modName of findModulesUnderNamespace(currentImpLoc.name,mod.name)){
                    if(searchForModuleUnderNamespace(currentImpLoc.name,modName,mod.name) == false){
                        throw NonExtError
                    }
               }
               currentImpLoc.modules[currentImpLoc.indexOfModuleByName(mod.name)].type = ModuleTypes.CjsNamespaceProvider
            }
        }
    }

}