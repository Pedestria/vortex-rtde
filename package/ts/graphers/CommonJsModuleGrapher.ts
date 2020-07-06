import { VortexGraph } from "../Graph.js";
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'
import Module, { ModuleTypes } from "../Module.js";
import CjsModuleDependency from "../dependencies/CjsModuleDependency.js";
import { Transport } from "../Transport.js";
import MDImportLocation from "../MDImportLocation.js";
import traverse from "@babel/traverse";
import * as t from '@babel/types'
import { QueueEntry } from "../GraphGenerator.js";

/**Searchs and Graphs JS code for CommonJS Dependencies
 * 
 * @param {QueueEntry} entry 
 * @param {VortexGraph} Graph 
 */

export function SearchAndGraph(entry:QueueEntry,Graph:VortexGraph,planetName?:string){

    // fs.writeJson('./debug.json',jsCode, err => {
    //         if (err) return console.error(err)
    //         console.log('Debug Written')
    //       })
    traverse(entry.ast,{
        VariableDeclarator: function(path) {
                let modules = []
                if (path.node.init !== null){
                    if (path.node.init.type === 'CallExpression') {
                        if(path.node.init.callee.name === 'require') {
                            if(path.node.id.type === 'ObjectPattern'){
                                for (let namedRequires of path.node.id.properties){
                                    //console.log(namedRequires.value)
                                    modules.push(new Module(namedRequires.value.name,ModuleTypes.CjsModule))
                                }
                            }
                            else{
                            modules.push(new Module(path.node.id.name,ModuleTypes.CjsNamespaceProvider))
                            }
                            //console.log(path.node.declarations[0].init.arguments[0].value)
                            let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,path.node.init.arguments[0].value)
                            Transport(new CjsModuleDependency(path.node.init.arguments[0].value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName)
                        } else if (path.node.init.callee.name === '_interopDefault'){
                            if(path.node.init.arguments[0].type === 'CallExpression'){
                                if(path.node.init.arguments[0].callee.name === 'require'){
                                    modules.push(new Module(path.node.id.name,ModuleTypes.CjsInteropRequire))
                                    let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,path.node.init.arguments[0].arguments[0].value);
                                    Transport(new CjsModuleDependency(path.node.init.arguments[0].arguments[0].value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName)
                                }
                            }
                        }
                    }
            }},
            ExpressionStatement: function(path) {
                let modules = []
                if (path.node.expression.type === 'AssignmentExpression') {
                    if(path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression'){
                        if(path.node.expression.right.callee.name === 'require') {
                            modules.push(new Module(path.node.expression.right.arguments[0].value,ModuleTypes.CjsNamespaceProvider))
                            let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,path.node.expression.right.arguments[0].value)
                            Transport(new CjsModuleDependency(path.node.expression.right.arguments[0].value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName)
                        }
                    }
                }
                if(path.node.expression.type === 'CallExpression'){
                    if(path.node.expression.callee.type === 'Identifier' && path.node.expression.callee.name == 'require'){
                        modules.push(new Module('_Default_',ModuleTypes.CjsDefaultModule))
                        let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,path.node.expression.arguments[0].value)
                        Transport(new CjsModuleDependency(path.node.expression.arguments[0].value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName)
                    }
                    if(path.node.expression.callee.type === 'CallExpression'){
                        if (path.node.expression.callee.callee.name === 'require'){
                            modules.push(new Module('_DefaultFunction_',ModuleTypes.CjsDefaultFunction));
                            let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,path.node.expression.callee.arguments[0].value)
                            Transport(new CjsModuleDependency(path.node.expression.callee.arguments[0].value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName)
                        }
                    }
                }
            }
        })

}