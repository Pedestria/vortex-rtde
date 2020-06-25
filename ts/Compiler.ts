import { VortexGraph } from "./Graph.js";
import * as fs from 'fs-extra'
import EsModuleDependency from "./dependencies/EsModuleDependency.js";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import * as Babel from "@babel/parser";
import { template, transformFile, transformFileSync, transformFromAstSync } from "@babel/core";
import * as t from '@babel/types';
import MDImportLocation from "./MDImportLocation.js";
import { ModuleTypes } from "./Module.js";
import Module from './Module'
import ModuleDependency from "./dependencies/ModuleDependency.js";
import CjsModuleDependency from "./dependencies/CjsModuleDependency.js";
import { BabelSettings } from "./Options.js";
import { queue, loadEntryFromQueue } from "./GraphGenerator.js";
import { PassThrough } from "stream";

function fixDependencyName(name:string){
    let NASTY_CHARS = '/@^$#*&!%'
    let newName:string = ""
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

/**
 * Creates a Star depending on the global config
 * @param {VortexGraph} Graph The Dependency Graph created by the Graph Generator 
 */
export default function Compile(Graph:VortexGraph){

    // let finalLib = LibCompile(Graph)

    // return finalLib

    WebAppCompile(Graph)
    // const buffer = fs.readFileSync('./test/func.js').toString()

    // const code = Babel.parse(buffer,{"sourceType":"module"})

    // let modules = []

    // let testBundle = new LibBundle

    // modules.push(new Module('haha',ModuleTypes.CjsNamespaceProvider))

    // removeImportsFromAST(code,new MDImportLocation('FILE',0,modules),'haha',testBundle)

}

/**Compiles a library bundle from a given Vortex Graph
 * 
 * @param {VortexGraph} Graph 
 */

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
                            removeExportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast,dep,libB)
                        }
                    }
                }
            }
            if(libB.isInQueue(dep.name)){
                if(dep.importLocations[0].modules[0].type === ModuleTypes.EsNamespaceProvider){
                    convertToNamespace(libB.loadEntryFromQueue(dep.name).ast,dep.importLocations[0])
                }
                removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast,dep,libB)
            }
            else{
                //Libraries are skipped completely in Lib Bundle
                if(dep.name.includes('./')){
                    let filename = fs.readFileSync(dep.name).toString()
                    libB.addEntryToQueue(new BundleEntry(dep.name,Babel.parse(filename,{"sourceType":'module'})))
                    if(dep.importLocations[0].modules[0].type === ModuleTypes.EsNamespaceProvider){
                        convertToNamespace(libB.loadEntryFromQueue(dep.name).ast,dep.importLocations[0])
                    }
                    removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast,dep,libB)
                }
            }
        }
    }

    //console.log(libB.queue)
    let finalAr = libB.queue.reverse()
    finalBundle += `/*NODE_REQUIRES*/ \n`
    finalBundle += libB.libs.join('\n')
    finalBundle += `\n /*LIB_CODE*/ \n`
    for(let ent of finalAr){
        finalBundle += Division()
        finalBundle += generate(ent.ast).code
    }
    finalBundle += `\n /*NODE_EXPORTS*/ \n`
    finalBundle += libB.exports.join('\n')
    return finalBundle
    //console.log(code)
    //return libB.code

}

/**Converts entire dependency file to a ECMAScript Module Namespace.
 * 
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {MDImportLocation} imploc First MDImport Location of current dependency 
 */

function convertToNamespace(ast:t.File,imploc:MDImportLocation){

    var namespace = t.variableDeclaration('var',new Array(t.variableDeclarator(t.identifier(imploc.modules[0].name))))

    traverse(ast,{
        ExportNamedDeclaration: function(path){
            if(path.node.declaration !== null){
                addToNamespace(path.node.declaration,namespace)
                path.remove()
            }
        },
        ExportDefaultDeclaration: function(path){
            if(path.node.declaration !== null){
                addToNamespace(path.node.declaration,namespace)
                path.remove()
            }
        }
    })

    ast.program.body.push(namespace)
    ast.program.body.reverse();
}

/**Adds Node (Function/Class/Variable) to given namespace
 * 
 * @param {t.FunctionDeclaration|t.ClassDeclaration|t.VariableDeclaration} Node 
 * @param {t.VariableDeclaration} namespace 
 */

function addToNamespace(Node:t.FunctionDeclaration | t.VariableDeclaration | t.ClassDeclaration ,namespace:t.VariableDeclaration){
    if(namespace.declarations[0].init !== null){
        if(namespace.declarations[0].init.type === 'ObjectExpression'){
            if(Node.type === 'FunctionDeclaration'){
                let name = Node.id
                Node.id = null;
                namespace.declarations[0].init.properties.push(t.objectProperty(name,t.functionExpression(null,Node.params,Node.body,Node.generator,Node.async)))
            } else if (Node.type === 'ClassDeclaration'){
                let name = Node.id
                namespace.declarations[0].init.properties.push(t.objectProperty(name,t.classExpression(null,Node.superClass,Node.body)))
            }
        }
    }
    else{
        let props = []
            if(Node.type === 'FunctionDeclaration'){
                let name = Node.id
                Node.id = null;
                props.push(t.objectProperty(name,t.functionExpression(null,Node.params,Node.body,Node.generator,Node.async)))
                namespace.declarations[0].init = t.objectExpression(props)
            } else if (Node.type === 'ClassDeclaration'){
                let name = Node.id
                props.push(t.objectProperty(name,t.classExpression(null,Node.superClass,Node.body)))
                namespace.declarations[0].init = t.objectExpression(props)
                
            }
    }
        
}


/**
 * Removes imports of CommonJS or ES Modules from the current Import Location depending on the type of Module Dependency given.
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {MDImportLocation} impLoc Current Import Location
 * @param {ModuleDependency} dep The Module Dependency
 * @param {LibBundle} libBund The Library Bundle
 */

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
            // MemberExpression: function(path) {
            //     //Visits if dep is NOT a lib but is a EsNamespaceProvider
            //     if(dep.name.includes('./')){
            //         if(impLoc.modules[0].type === ModuleTypes.EsNamespaceProvider){
            //             if(path.node.object.name === impLoc.modules[0].name){
            //                 if(path.node.property.name === 'default'){
            //                     path.replaceWith(t.identifier(findDefaultExportName(dep)))
            //                 }
            //                 else{
            //                     path.replaceWith(t.identifier(path.node.property.name))
            //                 }
            //             }
            //         }
            //     }
            // },
            Identifier: function(path) {
                //Visits if dep is a lib but NOT a EsNamespaceProvider
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

function removeExportsFromAST(ast:t.File,dep:ModuleDependency,libbund:LibBundle){

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
                if(path.node.declaration !== null){
                    if(path.node.declaration.type !== 'Identifier' || path.node.specifiers.length === 0){
                        path.replaceWith(path.node.declaration)
                    }
                    else{
                        path.remove()
                    }
                } 
                else {
                    if (findVortexExpose(path.node)){
                        for(let exp of getExposures(path.node)){
                                libbund.addEntryToExposedExports(exp)
                            }
                            path.remove()
                        }
                    else{
                        path.remove()
                    }
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
    let code = `\n /*VORTEX_DIVIDER*/ \n`
    return code
}

/**
 * The Library Bundle used in libCompile
 */
class LibBundle {
    /**
     * The LibBundle that contains all Bundle Entries.
     */
    queue:Array<BundleEntry> = []
    /**Array of compiled requires */
    libs:Array<string> = [] 
    /**Array of compiled exposures (exports) */
    exports:Array<string> = [] 

    constructor(){}

    /**
     * Adds an entry to the lib Bundle Queue
     * @param {BundleEntry} entry 
     */

    addEntryToQueue(entry:BundleEntry){
        this.queue.push(entry)
    }

    /**
     * Adds a CommonJS require entry to bundle libraries
     * @param {string} libname Name of library to add to requires 
     * @param {string} namespace Namespace applied to the entry 
     */

    addEntryToLibs(libname:string,namespace:string){
            const lib = CommonJSTemplate({
                NAMESPACE: t.identifier(namespace),
                LIBNAME: t.stringLiteral(libname)
            })

        const code = generate(lib)

        this.libs.push(code.code)

    }

    /**
     * Adds a CommonJS exports entry to bundle exposures
     * @param {string} exportName Name of Export to Expose.
     */

    addEntryToExposedExports(exportName:string){
        const exp = CJSExportsTemplate({
            EXPORT: t.identifier(exportName)
        })

        const code = generate(exp)

        this.exports.push(code.code)

    }

    /**
     * Checks to see if export has already been added to exposures
     * @param {string} exportName Name of Exposed Export
     * @return {boolean} True or False
     */

    isExportEntryInCode(exportName:string){
        for(let expo of this.exports){
            if(expo.includes(exportName)){
                return true
            }
        }
        return false
    }

    /**
     * Checks to see if export has already been added to requires.
     * @param {string} libName Name of library 
     * @param {string} namespace Namespace applied to the entry
     * @return {boolean} True or False
     */

    isLibEntryInCode(libName:string, namespace:string){
        for(let req of this.libs){
            if(req.includes(libName) && req.includes(namespace)){
                return true
            }
        }
        return false
    }

    /**
     * Checks to see if entry is in bundle queue already.
     * @param {string} entryName Name of Bundle Entry
     * @return {boolean} True or False
     */

    isInQueue(entryName:string){
        for(let ent of this.queue){
            if(ent.name == entryName){
                return true
            }
        }
        return false
    }
    /**
     * loads bundle entry from queue
     * @param {string} entryName Name of Bundle Entry
     * @returns {BundleEntry} The Bundle Entry if it exists
     */

    loadEntryFromQueue(entryName:string){
        for(let ent of this.queue){
            if(ent.name == entryName){
                return ent
            }
        }
    }

}

const CommonJSTemplate = template(`const NAMESPACE = require(LIBNAME)`)
const CJSExportsTemplate = template(`exports.EXPORT = EXPORT`)

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

function findVortexExpose(exportNode:t.ExportNamedDeclaration){
    //console.log(exportNode.trailingComments)
    if(exportNode.trailingComments !== undefined){


        let comments = exportNode.trailingComments.map(comm => comm.value)

        for(let comm of comments){
            if(comm === 'vortexExpose'){
                return true
            }
        }
    }
    else{
        for(let spec of exportNode.specifiers){
            if(spec.trailingComments !== undefined){
                if(spec.trailingComments[0].value === 'vortexExpose'){
                    return true
                }
            }
        }
    }

    return false

}

function getExposures(exportNode:t.ExportNamedDeclaration){

    let allExports:Array<string>= exportNode.specifiers.map(exp => exp.exported.name)
    if(exportNode.trailingComments !== undefined){
        let comments = exportNode.trailingComments.map(comm => comm.value)

        for(let comm of comments){
            if(comm === 'vortexExpose'){
                return allExports
            }
        }
        
    }
    let exports:Array<string> = []

    for(let spec of exportNode.specifiers){
        if(spec.trailingComments[0].value === 'vortexExpose'){
            exports.push(spec.exported.name)
        }
    }
    return exports
}
//
//
/*======WEBAPP COMPILER======*/
//
//
//

const ModuleEvalTemplate = template('eval(CODE)')

function WebAppCompile (Graph:VortexGraph){

   let shuttle = new Shuttle();

    for(let dep of Graph.Star){
        if(dep instanceof ModuleDependency){
            for(let impLoc of dep.importLocations){
                mangleVariableNamesFromAst(loadEntryFromQueue(impLoc.name).ast,impLoc.modules)
                TransformImportsFromAST(loadEntryFromQueue(impLoc.name).ast,impLoc,dep)
            }
        }
    }
    // if(dep.libLoc !== undefined){
    //     const mod = ModuleEvalTemplate({CODE:t.stringLiteral(generate(loadEntryFromQueue(dep.libLoc).ast).code)})
    //     shuttle.addModuleToBuffer(dep.libLoc,mod)
    // }
    // else{
    //     const mod = ModuleEvalTemplate({CODE:t.stringLiteral(generate(loadEntryFromQueue(dep.name).ast).code)})
    //     shuttle.addModuleToBuffer(dep.name,mod)
    // }


    //let finalCode = generate(shuttle.buffer).code
    //let tempAST = Babel.parse(generate(t.variableDeclaration('var',[t.variableDeclarator(t.identifier('_NAMESPACE'),shuttle.buffer)])).code)

    // for(let prop of tempAST.program.body[0].declarations[0].init.properties){
    //     prop.value.extra = {}
    //     prop.value.extra.parenthesized = true
    //     prop.value.extra.parenStart = prop.value.start-1
    // }

    let factory = `//Named Exports For Module
    var shuttle_exports = {}
    //Default Export For Module
    var shuttle_default = {}

    //Shuttle (New Module Definition)
    //Finds exports and returns them under fake namespace.
    function shuttle(mod_name){
        var fakeNamespace = {
            named:{},
            default:{}
        }
        modules[mod_name](shuttle,fakeNamespace.named = shuttle_exports,fakeNamespace.default = shuttle_default)
        return fakeNamespace
    }

    //Calls Entrypoint to Initialize
    modules["${Graph.entryPoint}"](shuttle,shuttle_exports,shuttle_default)`

    let parsedFactory = Babel.parse(factory).program.body

    let finalCode = generate(t.expressionStatement(t.callExpression(t.identifier(''),[t.callExpression(t.functionExpression(null,[t.identifier("modules")],t.blockStatement(parsedFactory),false,false),[shuttle.buffer])]))).code;

    fs.writeFileSync('./out/webapp.js',finalCode);
    console.log('Successfully Wrote Test to webapp.js')
}

class Shuttle {

    buffer = t.objectExpression([])

    //[shuttle,_exports_]

    addModuleToBuffer(entry:string,evalModule:t.Statement){
        let func = t.functionExpression(null,[t.identifier('shuttle'),t.identifier('shuttle_exports'),t.identifier('shuttle_default')],t.blockStatement([evalModule]),false,false)
        this.buffer.properties.push(t.objectProperty(t.stringLiteral(entry),t.callExpression(t.identifier(''),[func])))
    }

    isInBuffer(){

    }
}
//Shuttle Module Templates:

const ShuttleInitialize = template("var MODULE = shuttle(MODULENAME)")
const ShuttleExportNamed = template("shuttle_exports.EXPORT = EXPORT")
const ShuttleExportDefault = template("shuttle_default.export = EXPORT")

function TransformImportsFromAST(ast:t.File,currentImpLoc:MDImportLocation,dep:ModuleDependency){

    let namespace = `VORTEX_MODULE_${fixDependencyName(dep.name)}`

    if(dep instanceof EsModuleDependency){
            traverse(ast,{
                ImportDeclaration: function(path){
                    if(path.node.source.value === dep.name){
                        if(dep.name.includes('./')){
                            path.replaceWith(ShuttleInitialize({MODULE:namespace,MODULENAME:t.stringLiteral(dep.name)}))
                        } else{
                            path.replaceWith(ShuttleInitialize({MODULE:namespace,MODULENAME:t.stringLiteral(dep.libLoc)}))
                        }
                    }
                },
                Identifier: function(path){
                    if(currentImpLoc.indexOfModuleByName(path.node.name.slice(1)) !== null){
                        if(dep.name.includes('./') == false){
                            //If library but NOT default import from lib
                            if(currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type !== ModuleTypes.EsDefaultModule){
                                path.replaceWith(t.memberExpression(t.memberExpression(t.identifier(namespace),t.identifier('named')),t.identifier(path.node.name.slice(1))))
                            }
                            //if NOT library at all
                        } else{
                            if(currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name.slice(1))].type === ModuleTypes.EsDefaultModule){
                                path.replaceWith(t.memberExpression(t.memberExpression(t.identifier(namespace),t.identifier('default')),t.identifier('export')))
                            }
                            else{
                                path.replaceWith(t.memberExpression(t.memberExpression(t.identifier(namespace),t.identifier('named')),t.identifier(path.node.name.slice(1))))
                            }
                        }
                    }
                },
                //Reassigns lib default namespace to vortex namespace
                MemberExpression: function(path){
                    if(dep.name.includes('./') == false){
                        if(path.node.object.type === 'Identifier'){
                            let defaultMod = currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.object.name)]
                            if(defaultMod.type === ModuleTypes.EsDefaultModule && defaultMod.name === path.node.object.name){
                                path.replaceWith(t.memberExpression(t.memberExpression(t.identifier(namespace),t.identifier('named')),path.node.property))
                            }
                        }
                    }
                }
            })
        } else if(dep instanceof CjsModuleDependency){

            if(currentImpLoc.modules[0].type === ModuleTypes.CjsNamespaceProvider){
                traverse(ast,{
                    VariableDeclaration: function(path){
                        if(dep.name.includes('./')){
                            if (path.node.declarations[0].init !== null){
                                if (path.node.declarations[0].init.type === 'CallExpression') {
                                    if(path.node.declarations[0].init.callee.name === 'require') {
                                        if(path.node.declarations[0].id.name === currentImpLoc.modules[0].name && path.node.declarations[0].init.arguments[0].value === currentImpLoc.relativePathToDep){
                                            path.replaceWith(ShuttleInitialize({MODULE:currentImpLoc.modules[0].name,MODULENAME:t.stringLiteral(currentImpLoc.relativePathToDep)}))
                                        }
                                    }
                                }
                            }

                        } 
                        else {
                            if (path.node.declarations[0].init !== null){
                                if (path.node.declarations[0].init.type === 'CallExpression') {
                                    if(path.node.declarations[0].init.callee.name === 'require') {
                                        if(path.node.declarations[0].id.name === currentImpLoc.modules[0].name && path.node.declarations[0].init.arguments[0].value === dep.name){
                                            path.replaceWith(ShuttleInitialize({MODULE:currentImpLoc.modules[0].name,MODULENAME:t.stringLiteral(dep.name)}))
                                        }
                                    }
                                }
                            }
                        }
                    },
                    MemberExpression: function(path){
                        //Replaces CommonJs Namespaces if library does NOT have default export.
                        if(path.node.object.type === 'Identifier'){
                            if(path.node.object.name === currentImpLoc.modules[0].name && path.node.property !== null){
                                path.replaceWith(t.memberExpression(t.memberExpression(t.identifier(namespace),t.identifier('named')),path.node.property))
                            }
                        }
                    },
                    //Replaces CommonJs Namespace if library DOES have default export.
                    Identifier: function(path){
                        if(path.parent.type !== 'MemberExpression'){
                            if(path.node.name === currentImpLoc.modules[0].name){
                                path.replaceWith(t.memberExpression(t.memberExpression(t.identifier(namespace),t.identifier('default')),t.identifier('export')))
                            }
                        }
                    }
                })
            }

        }
}


function TransformExportsFromAST(ast:t.File,dep:ModuleDependency){

    if(dep instanceof EsModuleDependency){
        let exportsToBeRolled:Array<string> = []
        let defaultExport:string
        traverse(ast,{
            ExportNamedDeclaration: function(path){
                if(path.node.specifiers === undefined){
                    path.replaceWith(path.node.declaration)
                }
                else{
                    for(let exp of path.node.specifiers){
                        exportsToBeRolled.push(exp.exported.name)
                    }
                    path.remove()
                }
            },
            ExportDefaultDeclaration: function(path){
                if(path.node.declaration.type === 'FunctionDeclaration'){
                    defaultExport = path.node.declaration.id.name
                } else if(path.node.declaration.type === 'Identifier'){
                    defaultExport = path.node.declaration.name
                }
            }
        })
        //Rolls out/Converts exports to Shuttle Module Definition
        for(let expo of exportsToBeRolled){
            ast.program.body.push(ShuttleExportNamed({EXPORT:expo}))
        }
        //Pushes/converts default export to Shuttle Module Definition
        ast.program.body.push(ShuttleExportDefault({EXPORT:defaultExport}))
    }
    else if (dep instanceof CjsModuleDependency){
        traverse(ast,{
            ExpressionStatement: function(path){
                if(path.node.expression.type === 'AssignmentExpression'){
                    if(path.node.expression.left.type === 'MemberExpression'){
                        if(path.node.expression.left.object.type === 'Identifier'){
                            //Looks for CommonJs named exports
                            if(path.node.object.name === 'exports'){
                                path.replaceWith(ShuttleExportNamed({EXPORT:path.node.expression.left.property.name}))
                            }
                            else if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){
                                path.replaceWith(ShuttleExportDefault({EXPORT:path.node.expression.right.name}))
                            }
                        }
                    }
                }
            }
        })
    }

}
