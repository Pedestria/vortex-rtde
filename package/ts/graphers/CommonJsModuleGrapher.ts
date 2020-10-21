import { VortexGraph } from "../Graph.js";
import Module, { ModuleTypes } from "../Module.js";
import CjsModuleDependency from "../dependencies/CjsModuleDependency.js";
import { Transport } from "../Transport.js";
import MDImportLocation from "../importlocations/MDImportLocation.js";
import traverse from "@babel/traverse";
import { QueueEntry } from "../GraphGenerator.js";
import { isJs } from "../Resolve.js";
import { FileImportLocation } from "../importlocations/FileImportLocation.js";
import { resolveDependencyType } from "../DependencyFactory.js";
import {ControlPanel} from '../types/ControlPanel'
import  * as t from '@babel/types';
import { ParseResult } from "@babel/core";

/**Searchs and Graphs JS code for CommonJS Dependencies
 * 
 * @param {QueueEntry} entry 
 * @param {VortexGraph} Graph 
 */

export function SearchAndGraph(entry:QueueEntry,Graph:VortexGraph,planetName:string,ControlPanel:ControlPanel,ASTQueue){

    // fs.writeJson('./debug.json',jsCode, err => {
    //         if (err) return console.error(err)
    //         console.log('Debug Written')
    //       })
    traverse(entry.ast as ParseResult,{
        VariableDeclarator: function(path) {
            if(path.parent.type === "VariableDeclaration" && path.parent.trailingComments && path.parent.trailingComments.find(comment => comment.value === "vortexRetain")){
                return;
            }
                let modules = []
                if (path.node.init !== null){
                    if (path.node.init.type === 'CallExpression') {
                        if((path.node.init.callee as t.Identifier).name === 'require') {
                            if(path.node.id.type === 'ObjectPattern'){
                                for (let namedRequires of path.node.id.properties){
                                    //console.log(namedRequires.value)
                                    modules.push(new Module(((namedRequires as t.ObjectProperty).value as t.Identifier).name,"CjsModule"))
                                }
                            }
                            else{
                            modules.push(new Module((path.node.id as t.Identifier).name,"CjsNamespaceProvider"))
                            }

                            let Literal = path.node.init.arguments[0] as t.StringLiteral;
                            //console.log(path.node.declarations[0].init.arguments[0].value)
                            let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,Literal.value);
                            Transport(new CjsModuleDependency(Literal.value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue);
                        } else if ((path.node.init.callee as t.Identifier).name === '_interopDefault'){
                            if(path.node.init.arguments[0].type === 'CallExpression'){
                                if((path.node.init.arguments[0].callee as t.Identifier).name === 'require'){
                                    modules.push(new Module((path.node.id as t.Identifier).name,"CjsInteropRequire"))
                                    let Literal = path.node.init.arguments[0].arguments[0] as t.StringLiteral;
                                    let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,Literal.value);
                                    Transport(new CjsModuleDependency(Literal.value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
                                }
                            }
                        }
                    }
            }},
            ExpressionStatement: function(path) {
                let modules = []
                if (path.node.expression.type === 'AssignmentExpression') {
                    if(path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression'){
                        if((path.node.expression.right.callee as t.Identifier).name === 'require') {
                            let Literal = path.node.expression.right.arguments[0] as t.StringLiteral;
                            modules.push(new Module(Literal.value,"CjsNamespaceProvider"))
                            let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,Literal.value)
                            Transport(new CjsModuleDependency(Literal.value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
                        }
                    }
                }
                if(path.node.expression.type === 'CallExpression'){
                    if(path.node.expression.callee.type === 'Identifier' && path.node.expression.callee.name == 'require'){
                        let Literal = path.node.expression.arguments[0] as t.StringLiteral;
                        modules.push(new Module('_Default_',"CjsDefaultModule"))
                        let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,Literal.value)
                        Transport(new CjsModuleDependency(Literal.value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
                    }
                    if(path.node.expression.callee.type === 'CallExpression'){
                        if ((path.node.expression.callee.callee as t.Identifier).name === 'require'){
                            let Literal = path.node.expression.callee.arguments[0] as t.StringLiteral;
                            modules.push(new Module('_DefaultFunction_',"CjsDefaultFunction"));
                            let currentImpLoc = new MDImportLocation(entry.name,path.node.loc.start.line,modules,Literal.value)
                            Transport(new CjsModuleDependency(Literal.value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
                        }
                    }
                }
            },
            ObjectProperty: function(path){
                let modules =[]
                if(path.node.value.type === 'CallExpression' && path.node.value.callee.type === 'Identifier' && path.node.value.callee.name === 'require'){
                    let Literal = path.node.value.arguments[0] as t.StringLiteral;
                    if (isJs(Literal.value,ControlPanel)){ 
                        modules.push(new Module('CJSLoad',"CJSLoad"))
                        let currentImpLoc = new MDImportLocation(entry.name,0,modules,Literal.value);
                        Transport(new CjsModuleDependency(Literal.value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName,ControlPanel,ASTQueue)
                    } else {
                        nonModuleDependencyResolve(Literal.value,Graph);
                    }
                }
            }
        })

        function nonModuleDependencyResolve(DepLoc:string,Graph:VortexGraph){

            let fileImpLoc = new FileImportLocation(entry.name,0,DepLoc)
            let dep = resolveDependencyType(DepLoc,fileImpLoc,entry.name)
            Transport(dep,Graph,entry.name,null,planetName,ControlPanel,ASTQueue)

        }

}