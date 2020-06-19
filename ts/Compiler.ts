import { VortexGraph } from "./Graph.js";
import * as fs from 'fs-extra'
import EsModuleDependency from "./dependencies/EsModuleDependency.js";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import * as Babel from "@babel/parser";
import { template } from "@babel/core";
import * as t from '@babel/types';
import MDImportLocation from "./MDImportLocation.js";
import { ModuleTypes } from "./Module.js";
import Module from './Module'
import ModuleDependency from "./dependencies/ModuleDependency.js";
import CjsModuleDependency from "./dependencies/CjsModuleDependency.js";

function fixDependencyName(name:string){
    let NASTY_CHARS = '/@^$#*&!%'
    let newName:string
    if(name[0] === '@'){
        newName = name.slice(1)
    }
    for(let char of NASTY_CHARS){
        if(newName.includes(char)){
            let a 
            let b 
            a = newName.slice(0,newName.indexOf(char))
            b = newName.slice(newName.indexOf(char)+1)
            newName = `${a}_${b}`
        }
    }
    return newName

}

//Transforms VortexGraph into a Star/Bundle
export default function Compile(Graph:VortexGraph){

    let finalLib = LibCompile(Graph)

    return finalLib
    // const buffer = fs.readFileSync('./test/func.js').toString()

    // const code = Babel.parse(buffer,{"sourceType":"module"})

    // let modules = []

    // let testBundle = new LibBundle

    // modules.push(new Module('haha',ModuleTypes.CjsNamespaceProvider))

    // removeImportsFromAST(code,new MDImportLocation('FILE',0,modules),'haha',testBundle)

}

function LibCompile(Graph:VortexGraph){

    let libB = new LibBundle

    let finalBundle:string = ""

    
    for(let dep of Graph.Star){
        if(dep instanceof ModuleDependency){
            for(let impLoc of dep.importLocations){
                if(impLoc instanceof MDImportLocation){
                    if(libB.isInQueue(impLoc.name)){
                        if(dep.name.includes('./') == false && impLoc.modules[0].type !== ModuleTypes.EsNamespaceProvider){
                            mangleVariableNamesFromAst(libB.loadEntryFromQueue(impLoc.name).ast,impLoc.modules)
                        }
                        removeImportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast,impLoc,dep,libB)
                    }
                    else{
                        let filename = fs.readFileSync(impLoc.name).toString()
                        libB.addEntryToQueue(new BundleEntry(impLoc.name,Babel.parse(filename,{"sourceType":'module'})))
                        if(dep.name.includes('./') == false && impLoc.modules[0].type !== ModuleTypes.EsNamespaceProvider){
                            mangleVariableNamesFromAst(libB.loadEntryFromQueue(impLoc.name).ast,impLoc.modules)
                        }
                        removeImportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast,impLoc,dep,libB)
                        if(impLoc.name === Graph.entryPoint){
                            removeExportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast,dep)
                        }
                    }
                }
            }
            if(libB.isInQueue(dep.name)){
                removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast,dep)
            }
            else{
                if(dep.name.includes('./')){
                    let filename = fs.readFileSync(dep.name).toString()
                    libB.addEntryToQueue(new BundleEntry(dep.name,Babel.parse(filename,{"sourceType":'module'})))
                    removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast,dep)
                }
            }
        }
    }

    //console.log(libB.queue)
    finalBundle += libB.libs.join('\n')
    for(let ent of libB.queue){
        finalBundle += Division()
        finalBundle += generate(ent.ast).code
    }
    return finalBundle
    //console.log(code)
    //return libB.code

}

function removeImportsFromAST(ast:t.File,impLoc:MDImportLocation,dep:ModuleDependency,libBund:LibBundle){

    //Grabs all requires/imports of libs and converts them to CJS and places them at the top of bundle
    //
    if(dep instanceof CjsModuleDependency){
        if(dep.name.includes('./') == false){
            if(libBund.isLibEntryInCode(dep.name,impLoc.modules[0].name) == false){
                libBund.addEntryToLibs(dep.name,impLoc.modules[0].name)
            }
        }


            if(impLoc.modules[0].type === ModuleTypes.CjsNamespaceProvider){

            traverse(ast,{
                // Removes Require statements.
                VariableDeclaration: function(path) {
                    if (path.node.declarations[0].init !== null){
                        if (path.node.declarations[0].init.type === 'CallExpression') {
                            if(path.node.declarations[0].init.callee.name === 'require') {
                                if(path.node.declarations[0].id.name === impLoc.modules[0].name && path.node.declarations[0].init.arguments[0].value === impLoc.relativePathToDep){
                                    path.remove()
                                }
                            }
                        }
                    }
                },
                //Removes Namespace from all references calls to namespace
                MemberExpression : function(path){
                    if(dep.name.includes('./')){

                        if(path.node.object.name == impLoc.modules[0].name){
                            if(path.node.property !== null){
                                if(path.node.property.name === 'default'){
                                    path.replaceWith(
                                        t.identifier(findDefaultExportName(dep))
                                    )
                                }
                                else{
                                    path.replaceWith(
                                        t.identifier(path.node.property.name)
                                    )
                                }
                            }
                        }
                    }
                } 
            })
        }
    } 
    else if (dep instanceof EsModuleDependency){
            if(dep.name.includes('./') == false){
                if(impLoc.modules[0].type === ModuleTypes.EsNamespaceProvider){
                    if(libBund.isLibEntryInCode(dep.name,impLoc.modules[0].name) == false){
                        libBund.addEntryToLibs(dep.name,impLoc.modules[0].name)
                    }
                }
                else{
                    var namespace = `${fixDependencyName(dep.name)}_NAMESPACE`
                    if(libBund.isLibEntryInCode(dep.name,namespace) == false){
                        libBund.addEntryToLibs(dep.name,namespace)
                    }
                }
            }
        
        

        traverse(ast,{ 
            ImportDeclaration: function(path) {
                //Removes imports regardless if dep is lib or local file.
                if(path.node.source.value === impLoc.relativePathToDep){
                    path.remove()
                }
            },
            MemberExpression: function(path) {
                //Visits if dep is NOT a lib but is a EsNamespaceProvider
                if(dep.name.includes('./')){
                    if(impLoc.modules[0].type === ModuleTypes.EsNamespaceProvider){
                        if(path.node.object.name === impLoc.modules[0].name){
                            if(path.node.property.name === 'default'){
                                path.replaceWith(t.identifier(findDefaultExportName(dep)))
                            }
                            else{
                                path.replaceWith(t.identifier(path.node.property.name))
                            }
                        }
                    }
                }
            },
            Identifier: function(path) {
                if(dep.name.includes('./') == false){
                    if(impLoc.modules[0].type !== ModuleTypes.EsNamespaceProvider){
                        for(let mod of impLoc.modules){
                            if(mod.type !== ModuleTypes.EsDefaultModule){
                                if(path.node.name === '_'+mod.name){
                                    path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier(mod.name)))
                                }
                            }
                            else if (mod.type === ModuleTypes.EsDefaultModule){
                                if(path.node.name === '_'+mod.name){
                                    path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier('default')))
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}

function findDefaultExportName(dep:ModuleDependency){

    let buffer =  fs.readFileSync(dep.name).toString()

    let code = Babel.parse(buffer,{"sourceType":"module"})

    let name

    if (dep instanceof CjsModuleDependency){

            traverse(code,{
                ExpressionStatement: function(path){
                    if(path.node.expression.type === 'AssignmentExpression'){
                        if(path.node.expression.left.type === 'MemberExpression'){
                            // if(path.node.expression.left !== null){
                            //     if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){

                            //     }
                            // }
                        
                    if(path.node.expression.left !== null){
                        if(path.node.expression.left.object.name === 'exports'){
                            if(path.node.expression.left.property.name === 'default'){
                                name = path.node.expression.right.name
                            }
                            }
                        }
                    }
            
                }
            }
        })
    } else if (dep instanceof EsModuleDependency){

        traverse(code,{
            ExportDefaultDeclaration: function(path){
                if(path.node.declaration !== null){
                    name = path.node.declaration.id.name
                }
            },
            ExportNamedDeclaration: function(path){
                if(path.node.declaration == null){
                    for(let ImpType of path.node.specifiers){
                        if(ImpType.type === 'ExportSpecifier'){
                            if(ImpType.exported.name === 'default'){
                                name = ImpType.local.name
                            }
                        }
                    }
                }
            }
        })

    }
    return name

}

function removeExportsFromAST(ast:t.File,dep:ModuleDependency){

    if(dep instanceof CjsModuleDependency){

        traverse(ast,{
            ExpressionStatement: function(path){
                if(path.node.expression.type === 'AssignmentExpression'){
                    if(path.node.expression.left.type === 'MemberExpression'){
                        if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){
                            path.remove()
                        }
                    if(path.node.expression.left.object.name === 'exports'){
                        path.remove()
                    }
                }
            }
        }})
    } 
    else if (dep instanceof EsModuleDependency){
        traverse(ast,{
            ExportNamedDeclaration: function(path) {
                if(path.node.declaration.type !== 'Identifier' || path.node.specifiers.length === 0){
                    path.replaceWith(path.node.declaration)
                }
                else{
                    path.remove()
                }
            },
            ExportDefaultDeclaration: function(path) {
                if(path.node.declaration.type !== 'Identifier'){
                    path.replaceWith(path.node.declaration)
                }
                else{
                    path.remove()
                }
            }
        })

    }

}

function Division(){
    let code = `\n /******VORTEX_DIVIDER******/ \n`
    return code
}

class LibBundle {
    queue:Array<BundleEntry> = []
    libs:Array<string> = []

    constructor(){}

    addEntryToQueue(entry:BundleEntry){
        this.queue.push(entry)
    }

    addEntryToLibs(libname:string,namespace:string){
            const lib = CommonJSTemplate({
                NAMESPACE: t.identifier(namespace),
                LIBNAME: t.stringLiteral(libname)
            })

        const code = generate(lib)

        this.libs.push(code.code)

    }

    isLibEntryInCode(libName:string, namespace:string){
        for(let req of this.libs){
            if(req.includes(libName) && req.includes(namespace)){
                return true
            }
        }
        return false
    }

    isInQueue(entryName:string){
        for(let ent of this.queue){
            if(ent.name == entryName){
                return true
            }
        }
        return false
    }

    loadEntryFromQueue(entryName:string){
        for(let ent of this.queue){
            if(ent.name == entryName){
                return ent
            }
        }
    }

}

const CommonJSTemplate = template(`const NAMESPACE = require(LIBNAME)`)

class BundleEntry{
    name:string
    ast:t.File

    constructor(name:string,ast:t.File){
        this.name = name
        this.ast = ast

    }
}

function mangleVariableNamesFromAst(ast:t.File,impLocModules:Array<Module>){
    traverse(ast,{
        Identifier: function(path){
            for(let mod of impLocModules){
                if(mod.name === path.node.name){
                    path.node.name = `_${path.node.name}`
                }
            }
        }
    })

}