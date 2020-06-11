import { VortexGraph } from "../Graph.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from "../Module.js";
import Dependency from "../Dependency.js";
import chalk = require("chalk");

export function SearchAndGraph(file:string,Graph:VortexGraph){

    const buffer = fs.readFileSync(file,'utf-8').toString();

    let regexp = new RegExp('./')

    const jsCode = Babel.parse(buffer,{"sourceType":"module"}).program.body

    for (let node of jsCode){
        if (node.type === 'VariableDeclaration') {
            let modules = []
            if (node.declarations[0].init.type === 'CallExpression') {
                if(node.declarations[0].init.callee.name === 'require') {
                    if(node.declarations[0].id.type === 'ObjectPattern'){
                        for (let namedRequires of node.declarations[0].id.properties){
                            //console.log(namedRequires.value)
                            modules.push(new Module(namedRequires.value.name,ModuleTypes.CjsModule))
                        }
                    }
                    else{
                    modules.push(new Module(node.declarations[0].id.name,ModuleTypes.CjsDefaultModule))
                    }
                    let dep = new Dependency(node.declarations[0].init.arguments[0].value,modules,file)
                    if (Graph.searchFor(dep)){
                        Graph.update(dep)
                    }
                    else{
                        Graph.add(dep);
                    }
                if (node.declarations[0].init.arguments[0].value.match(regexp) !== null){
                        VerifyModulesForDependency(node.declarations[0].init.arguments[0].value,modules);
                }
                }
            }
        }
        if (node.type === 'ExpressionStatement') {
            let modules = []
            if (node.expression.type === 'AssignmentExpression') {
                if(node.expression.left.type === 'MemberExpression' && node.expression.right.type === 'CallExpression'){
                    if(node.expression.right.callee.name === 'require') {
                        modules.push(new Module(node.expression.right.arguments[0].value,ModuleTypes.CjsDefaultModule))
                        let dep = new Dependency('_CURRENT_cjs-exports',modules,file)
                        if (Graph.searchFor(dep)){
                            Graph.update(dep)
                        }
                        else{
                            Graph.add(dep); 
                        }
                    }
                }
            }
        }
    }
}