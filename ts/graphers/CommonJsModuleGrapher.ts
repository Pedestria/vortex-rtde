import { VortexGraph } from "../Graph.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import traverse, { Scope } from '@babel/traverse'
import Module, { ModuleTypes } from "../Module.js";
import Dependency from "../Dependency.js";
import chalk = require("chalk");
import CjsModuleDependency from "../dependencies/CjsModuleDependency.js";
import path = require('path')
import { LocalizedResolve, addJsExtensionIfNecessary } from "../Resolve.js";
import { Transport } from "../Transport.js";
import MDImportLocation from "../MDImportLocation.js";

export function SearchAndGraph(file:string,Graph:VortexGraph){

    const buffer = fs.readFileSync(file,'utf-8').toString();

    let str = './'

    const jsCode = Babel.parse(buffer,{"sourceType":"module"})

    // fs.writeJson('./debug.json',jsCode, err => {
    //         if (err) return console.error(err)
    //         console.log('Debug Written')
    //       })
    traverse(jsCode,{
        VariableDeclaration: function(path) {
                let modules = []
                if (path.node.declarations[0].init !== null){
                    if (path.node.declarations[0].init.type === 'CallExpression') {
                        if(path.node.declarations[0].init.callee.name === 'require') {
                            if(path.node.declarations[0].id.type === 'ObjectPattern'){
                                for (let namedRequires of path.node.declarations[0].id.properties){
                                    //console.log(namedRequires.value)
                                    modules.push(new Module(namedRequires.value.name,ModuleTypes.CjsModule))
                                }
                            }
                            else{
                            modules.push(new Module(path.node.declarations[0].id.name,ModuleTypes.CjsDefaultOrNamespaceModule))
                            }
                            //console.log(path.node.declarations[0].init.arguments[0].value)
                            let currentImpLoc = new MDImportLocation(file,path.node.loc.start.line,modules)
                            Transport(new CjsModuleDependency(path.node.declarations[0].init.arguments[0].value,currentImpLoc),Graph,file,currentImpLoc)
                        }
                    }
            }}});

        traverse(jsCode,{
            ExpressionStatement: function(path) {
                let modules = []
                if (path.node.expression.type === 'AssignmentExpression') {
                    if(path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression'){
                        if(path.node.expression.right.callee.name === 'require') {
                            modules.push(new Module(path.node.expression.right.arguments[0].value,ModuleTypes.CjsDefaultOrNamespaceModule))
                            let currentImpLoc = new MDImportLocation(file,path.node.loc.start.line,modules)
                            Transport(new CjsModuleDependency(path.node.expression.right.arguments[0].value,currentImpLoc),Graph,file,currentImpLoc)
                        }
                    }
                }
                if(path.node.expression.type === 'CallExpression'){
                    if(path.node.expression.callee.type === 'Identifier' && path.node.expression.callee.name == 'require'){
                        modules.push(new Module('_Default_',ModuleTypes.CjsDefaultOrNamespaceModule))
                        let currentImpLoc = new MDImportLocation(file,path.node.loc.start.line,modules)
                        Transport(new CjsModuleDependency(path.node.expression.arguments[0].value,currentImpLoc),Graph,file,currentImpLoc)
                    }
                    if(path.node.expression.callee.type === 'CallExpression'){
                        if (path.node.expression.callee.callee.name === 'require'){
                            modules.push(new Module('_DefaultFunction_',ModuleTypes.CjsDefaultFunction));
                            let currentImpLoc = new MDImportLocation(file,path.node.loc.start.line,modules)
                            Transport(new CjsModuleDependency(path.node.expression.callee.arguments[0].value,currentImpLoc),Graph,file,currentImpLoc)
                        }
                    }
                }
            }
        })

}