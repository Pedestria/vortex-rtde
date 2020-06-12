import { VortexGraph } from "../Graph.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from "../Module.js";
import Dependency from "../Dependency.js";
import chalk = require("chalk");
import CjsModuleDependency from "../dependencies/CjsModuleDependency.js";
import path = require('path')
import { LocalizedResolve } from "../Resolve.js";

export function SearchAndGraph(file:string,Graph:VortexGraph){

    const buffer = fs.readFileSync(file,'utf-8').toString();

    let regexp = new RegExp('./')

    const jsCode = Babel.parse(buffer,{"sourceType":"module"}).program.body

    // fs.writeJson('./debug.json',jsCode, err => {
    //         if (err) return console.error(err)
    //         console.log('Debug Written')
    //       })

    for (let node of jsCode){
        //console.log(node)
        if (node.type === 'VariableDeclaration') {
            //console.log(node)
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
                    let depName = LocalizedResolve(file,node.declarations[0].init.arguments[0].value)
                    if(node.declarations[0].init.arguments[0].value.match(regexp) == null){
                        depName = node.declarations[0].init.arguments[0].value
                    }
                    let dep = new CjsModuleDependency(depName,modules,file)
                    if (node.declarations[0].init.arguments[0].value.match(regexp) !== null){
                        let filename = node.declarations[0].init.arguments[0].value
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
        if (node.type === 'ExpressionStatement') {
            let modules = []
            if (node.expression.type === 'AssignmentExpression') {
                if(node.expression.left.type === 'MemberExpression' && node.expression.right.type === 'CallExpression'){
                    if(node.expression.right.callee.name === 'require') {
                        modules.push(new Module(node.expression.right.arguments[0].value,ModuleTypes.CjsDefaultModule))
                        let depName = LocalizedResolve(file,node.expression.right.arguments[0].value)
                        if(node.expression.right.arguments[0].value.match(regexp) == null){
                            depName = node.expression.right.arguments[0].value
                        }
                        let dep = new CjsModuleDependency(depName,modules,file)
                        if (node.expression.right.arguments[0].value.match(regexp) !== null){
                            let filename = node.expression.right.arguments[0].value
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
            if(node.expression.type === 'CallExpression'){
                if(node.expression.callee.type === 'CallExpression'){
                    if (node.expression.callee.callee.name === 'require'){
                        modules.push(new Module('_DefaultFunction_',ModuleTypes.CjsDefaultFunction));

                        let depName = LocalizedResolve(file,node.expression.callee.arguments[0].value)
                        if(node.expression.callee.arguments[0].value.match(regexp) == null){
                            depName = node.expression.callee.arguments[0].value
                        }
                        let dep = new CjsModuleDependency(depName,modules,file)
                        if(node.expression.callee.arguments[0].value.match(regexp) !== null){
                            let filename = node.expression.callee.arguments[0].value
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
        }
    }
}