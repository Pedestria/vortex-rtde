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
            },
            ObjectProperty: function(path){
                let modules =[]
                if(path.node.value.type === 'CallExpression' && path.node.value.callee.type === 'Identifier' && path.node.value.callee.name === 'require'){
                    if (isJs(path.node.value.arguments[0].value)){ 
                        modules.push(new Module('CJSLoad',ModuleTypes.CJSLoad))
                        let currentImpLoc = new MDImportLocation(entry.name,0,modules,path.node.value.arguments[0].value);
                        Transport(new CjsModuleDependency(path.node.value.arguments[0].value,currentImpLoc),Graph,entry.name,currentImpLoc,planetName)
                    } else {
                        nonModuleDependencyResolve(path.node.value.arguments[0].value,Graph);
                    }
                }
            }
        })

        function nonModuleDependencyResolve(DepLoc:string,Graph:VortexGraph){

            let fileImpLoc = new FileImportLocation(entry.name,0,DepLoc)
            let dep = resolveDependencyType(DepLoc,fileImpLoc,entry.name)
            Transport(dep,Graph,entry.name,null,planetName)

        }

}