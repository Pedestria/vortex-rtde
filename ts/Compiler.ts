import { VortexGraph } from "./Graph.js";
import * as fs from 'fs-extra'
import EsModuleDependency from "./dependencies/EsModuleDependency.js";
import generate from "@babel/generator";
import traverse, { Node } from "@babel/traverse";
import * as Babel from "@babel/parser";
import { template } from "@babel/core";
import * as t from '@babel/types';
import MDImportLocation from "./MDImportLocation.js";
import { ModuleTypes } from "./Module.js";
import Module from './Module'

//Transforms VortexGraph into a Star/Bundle
export default function Compile(Graph:VortexGraph){

    let finalLib = CommonJSLibCompile(Graph)

    return finalLib
    // const buffer = fs.readFileSync('./test/func.js').toString()

    // const code = Babel.parse(buffer,{"sourceType":"module"})

    // let modules = []

    // let testBundle = new LibBundle

    // modules.push(new Module('haha',ModuleTypes.CjsNamespaceProvider))

    // removeImportsFromAST(code,new MDImportLocation('FILE',0,modules),'haha',testBundle)

}

function CommonJSLibCompile(Graph:VortexGraph){

    let libB = new LibBundle

    let finalBundle:string = ""

    
    for(let dep of Graph.Star){
        for(let impLoc of dep.importLocations){
            if(impLoc instanceof MDImportLocation){
                if(libB.isInQueue(impLoc.name)){
                    removeImportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast,impLoc,dep.name,libB)
                }
                else{
                    let filename = fs.readFileSync(impLoc.name).toString()
                    libB.addEntryToQueue(new BundleEntry(impLoc.name,Babel.parse(filename)))
                    removeImportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast,impLoc,dep.name,libB)
                    if(impLoc.name === Graph.entryPoint){
                        removeExportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast)
                    }
                }
            }
        }
        if(libB.isInQueue(dep.name)){
            removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast)
        }
        else{
            if(dep.name.includes('./')){
                let filename = fs.readFileSync(dep.name).toString()
                libB.addEntryToQueue(new BundleEntry(dep.name,Babel.parse(filename)))
                removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast)
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

function removeImportsFromAST(ast:t.File,impLoc:MDImportLocation,depName:string,libBund:LibBundle){


    if(depName.includes('./') == false){
        if(libBund.isLibEntryInCode(depName,impLoc.modules[0].name) == false){
            libBund.addEntryToLibs(depName,impLoc.modules[0].name)
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
                    if(depName.includes('./')){

                        if(path.node.object.name == impLoc.modules[0].name){
                            if(path.node.property !== null){
                                if(path.node.property.name === 'default'){
                                    path.replaceWith(
                                        t.identifier(findDefaultExportName(depName))
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

function findDefaultExportName(file:string){

    let buffer =  fs.readFileSync(file).toString()

    let code = Babel.parse(buffer,{"sourceType":"module"})

    let name

    traverse(code,{
        ExpressionStatement: function(path){
            if(path.node.expression.type === 'AssignmentExpression'){
                if(path.node.expression.left.type === 'MemberExpression'){
                    if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){

                    }
                }
                if(path.node.expression.left.object.name === 'exports'){
                    if(path.node.expression.left.property.name === 'default'){
                        name = path.node.expression.right.name
                    }
                }
            }
        }
    })
    return name

}

function removeExportsFromAST(ast:t.File){

    traverse(ast,{
        ExpressionStatement: function(path){
            if(path.node.expression.type === 'AssignmentExpression'){
                if(path.node.expression.left.type === 'MemberExpression'){
                    if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){
                        path.remove()
                    }
                }
                if(path.node.expression.left.object.name === 'exports'){
                    path.remove()
                }
            }
        }
    })

}

function Division(){
    let code = `\n /******Division******/ \n`
    return code
}

class LibBundle {
    queue:Array<BundleEntry> = []
    libs:Array<string> = []

    constructor(){}

    addEntryToQueue(entry:BundleEntry){
        this.queue.push(entry)
    }

    addEntryToLibs(libName:string,namespace:string){
        const lib = CommonJSTemplate({
            NAMESPACE: t.identifier(namespace),
            LIBNAME: t.stringLiteral(libName)
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