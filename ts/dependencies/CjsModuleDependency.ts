import ModuleDependency from "./ModuleDependency.js"
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from '../Module'
import chalk = require("chalk");

export default class CjsModuleDependency extends ModuleDependency{

    constructor(name:string,acquiredModules:Array<Module>,initSuperDependency?:string,libLoc?:string) {
        super(name,acquiredModules,initSuperDependency,libLoc);
    }

    verifyImportedModules(file:string){

        const buffer = fs.readFileSync(file,'utf-8').toString();

        const jsCode = Babel.parse(buffer,{"sourceType":"module"}).program.body

        let modBuffer = []

        //console.log("Calling" + file)

        for (let node of jsCode){
            if(node.type === 'ExpressionStatement'){
                if(node.expression.type === 'AssignmentExpression'){
                    if(node.expression.left.type === 'MemberExpression'){
                        if(node.expression.left.object.name === 'module' && node.expression.left.property.name === 'exports'){
                            //console.log(node.expression.right)
                            if(node.expression.right.type === 'FunctionExpression' || node.expression.right.type === 'ArrowFunctionExpression'){
                                modBuffer.push(new Module('_DefaultFunction_',ModuleTypes.CjsDefaultFunction))
                            }
                            else{
                                modBuffer.push(new Module(node.expression.right.name,ModuleTypes.CjsModule))
                            }
                        } 
                    }
                }
            }
        }

        let testDep = new ModuleDependency('buffer',modBuffer)

        // let confModImp = []
        // let confModExp = []


        // console.log(confModExp,confModImp)

        // console.log(this.acquiredModules)
        // console.log(modBuffer)

        let NonExtError = new Error(chalk.bgRed('Non Existant Modules Imported from ' + file))

        for(let mod of this.acquiredModules){
            if(testDep.testForModule(mod) == false){
                throw NonExtError
            }
        }
    }

}