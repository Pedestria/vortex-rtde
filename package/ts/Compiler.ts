import { VortexGraph } from "./Graph.js";
import * as fs from 'fs-extra'
import * as FS from 'fs/promises'
import EsModuleDependency from "./dependencies/EsModuleDependency.js";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import * as Babel from "@babel/parser";
import template from '@babel/template'
import * as t from '@babel/types';
import MDImportLocation from "./importlocations/MDImportLocation.js";
import { ModuleTypes } from "./Module.js";
import Module from './Module'
import ModuleDependency from "./dependencies/ModuleDependency.js";
import CjsModuleDependency from "./dependencies/CjsModuleDependency.js";
import { CSSDependency } from "./dependencies/CSSDependency.js";
import { FileImportLocation } from "./importlocations/FileImportLocation.js";
import { VortexError, VortexErrorType } from "./VortexError.js";
import { FileDependency } from "./dependencies/FileDependency.js";
import {LocalizedResolve} from "./Resolve.js";
import * as path from 'path'
import * as css from 'css'
import { Planet, PlanetClusterMapObject } from "./Planet.js";
import * as _ from 'lodash';
import { notNativeDependency, resolveTransformersForNonNativeDependency, CustomDependencyIsBundlable } from "./DependencyFactory.js";
import { v4 } from "uuid";
import VTPanel = require("../vortex.panel.js");

var CSS_PLANET_ID = v4();

var cssStorage:Array<string> = []

export function pipeCSSContentToBuffer(content:string):void{
    cssStorage.push(content)
}

export interface Bundle {
    code:string
    value:string
}

type VTXPanel = typeof VTPanel;


function fixDependencyName(name:string){
    if(name[0] === '@'){
        name = name.slice(1);
    }
    let NASTY_CHARS = /(@|\/|\^|\$|#|\*|&|!|%|-|\.|\\)/g
    return name.replace(NASTY_CHARS,"_");
}

/**
 * Creates a Star/Solar System depending on the global config/async imports.
 * @param {VortexGraph} Graph The Dependency Graph created by the Graph Generator 
 * @returns {Promise<Bundle[]>} An Array of Bundle Code Objects
 */
export async function Compile(Graph:VortexGraph,ControlPanel:VTXPanel) : Promise<Bundle[]>{
    let final

    if(ControlPanel.isLibrary){
        //Returns a single bundle code object
        final = LibCompile(Graph,ControlPanel)
    }
    else{
        //Returns single/many bundle code object/s.
        final = WebAppCompile(Graph,ControlPanel)
    }

    return final;
}

/**Compiles a library bundle from a given Vortex Graph into CommonJS Format (Eventually into CommonJS IIFE!)
 * 
 * @param {VortexGraph} Graph 
 */

function LibCompile(Graph:VortexGraph,ControlPanel){

    let libB = new LibBundle

    
    for(let dep of Graph.Star){
        if(dep instanceof ModuleDependency){
            for(let impLoc of dep.importLocations){
                if(impLoc instanceof MDImportLocation){
                    let ast = Graph.queue.loadEntryFromQueue(impLoc.name).ast as t.File

                    convertImportsFromAST(Graph.queue.loadEntryFromQueue(impLoc.name).ast as t.File,impLoc,dep,libB)

                    if(impLoc.name === Graph.entryPoint){
                        convertExportsFromAST(Graph.queue.loadEntryFromQueue(impLoc.name).ast as t.File,dep,libB)
                    }
                }
            }
            if(!dep.outBundle){

                let ast = Graph.queue.loadEntryFromQueue(dep.name).ast as t.File
                    //Libraries are skipped completely in Lib Bundle
                if(!dep.isLibraryDependency()){
                    convertExportsFromAST(ast,dep,libB)
                }
            }
        }
    }

    let cjsIIFE:string = `var fileExportBuffer = {};

    ${libB.libs.join('\n')}

    function _localRequire(id){
        if(fileExportBuffer[id] && fileExportBuffer[id].built){
            return fileExportBuffer[id].exports
        }
        else {
            var localFile = {
                built:false,
                exports:{}
            }
            local_files[id](_localRequire,localFile.exports,${libB.namespaceLibNames.join(',')})

            localFile.built = true

            Object.defineProperty(fileExportBuffer,id,{
                value:localFile,
                writable:false,
                enumerable:true
            })

            return localFile.exports
        }
    }

    return _localRequire("${Graph.shuttleEntry}");`

    let parsedFactory = Babel.parse(cjsIIFE,{allowReturnOutsideFunction:true}).program.body

    let localFileIIFEBuffer:Array<t.ObjectProperty> = []

    let entryFuncArgs = libB.namespaceLibNames.map(arg => t.identifier(arg))

    for (let entry of Graph.queue.queue){
        localFileIIFEBuffer.push(t.objectProperty(t.stringLiteral(entry.name),t.callExpression(t.identifier(""),[t.functionExpression(null,[t.identifier("_localRequire"),t.identifier("_localExports")].concat(entryFuncArgs),t.blockStatement(entry.ast.program.body))])))
    }

    let finalCode = generate(t.callExpression(t.callExpression(t.identifier(""),[t.functionExpression(null,[t.identifier("local_files")],t.blockStatement(parsedFactory))]),[t.objectExpression(localFileIIFEBuffer)]));

    
    var o:Bundle = {value:'star',code:finalCode.code}
    
    return [o]
    //console.log(code)
    //return libB.code

}


/**
 * Removes imports of CommonJS or ES Modules from the current Import Location depending on the type of Module Dependency given.
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {MDImportLocation} impLoc Current Import Location
 * @param {ModuleDependency} dep The Module Dependency
 * @param {LibBundle} libBund The Library Bundle
 */

 async function convertImportsFromAST(ast:t.File,impLoc:MDImportLocation,dep:ModuleDependency,libBund:LibBundle){

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
                                        if(dep.name.includes('./')){
                                            path.node.declarations[0].init.callee.name = "_localRequire"
                                        } 
                                        else {
                                            path.remove()
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
    } else if (dep instanceof EsModuleDependency){
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
                //console.log(impLoc.relativePathToDep)
                if(path.node.trailingComments === undefined || path.node.trailingComments[0].value !== 'vortexRetain'){
                    if(path.node.source.value === impLoc.relativePathToDep){
                        if(dep.name.includes('./')){
                        //TODO!! Make Function to Build Requests for imports
                            path.replaceWith(buildImportsFromImportLocation(impLoc,dep));
                        }
                        else {
                            path.remove();
                        }
                    }
                }      //Vortex retain feature
                else if(path.node.trailingComments[0].value === 'vortexRetain' && dep.outBundle === true){
                    if(dep.name.includes('./')){
                        libBund.addEntryToLibs(impLoc.relativePathToDep,impLoc.modules[0].name);
                        path.remove()
                    }else{
                        throw new VortexError(`Cannot use "vortexRetain" keyword on libraries. Line:${impLoc.line} File:${impLoc.name}`,VortexErrorType.StarSyntaxError);
                    }
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
                if(path.parent.type !== "MemberExpression"){
                //Visits if dep is a lib but NOT a EsNamespaceProvider
                    if(dep.name.includes('./') == false){
                        if(impLoc.modules[0].type !== ModuleTypes.EsNamespaceProvider){
                            for(let mod of impLoc.modules){
                                if(mod.type !== ModuleTypes.EsDefaultModule){
                                    if(path.node.name === mod.name){
                                        path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier(mod.name)))
                                    }
                                }
                                else if (mod.type === ModuleTypes.EsDefaultModule){
                                    if(path.node.name === mod.name){
                                        path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier('default')))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}

function buildImportsFromImportLocation(currentMDImpLoc:MDImportLocation,currentDependency:ModuleDependency):t.VariableDeclaration{

    let declarators:t.VariableDeclarator[] = []

    if(currentDependency instanceof EsModuleDependency){
        if(currentMDImpLoc.modules[0].type === ModuleTypes.EsNamespaceProvider){
            declarators.push(t.variableDeclarator(t.identifier(currentMDImpLoc.modules[0].name),t.callExpression(t.identifier("_localRequire"),[t.stringLiteral(currentDependency.name)])));
            return t.variableDeclaration("var",declarators);
        }
        declarators.push(t.variableDeclarator(t.identifier(fixDependencyName(currentDependency.name.toUpperCase())),t.callExpression(t.identifier("_localRequire"),[t.stringLiteral(currentDependency.name)])));
        for(let IMPORT of currentMDImpLoc.modules){
            if(IMPORT.type === ModuleTypes.EsDefaultModule){
                declarators.push(t.variableDeclarator(t.identifier(IMPORT.name),t.memberExpression(t.identifier(fixDependencyName(currentDependency.name.toUpperCase())),t.identifier("default"))))
                continue;
            }
            declarators.push(t.variableDeclarator(t.identifier(IMPORT.name),t.memberExpression(t.identifier(fixDependencyName(currentDependency.name.toUpperCase())),t.identifier(IMPORT.name))));
        }
    }

    return t.variableDeclaration("var",declarators);

}

function convertExportsFromAST(ast:t.File,dep:ModuleDependency,libbund:LibBundle){

    if(dep instanceof CjsModuleDependency){

        traverse(ast,{
            ExpressionStatement: function(path){
                if(path.node.expression.type === 'AssignmentExpression'){
                    if(path.node.expression.left.type === 'MemberExpression'){
                        if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){
                            path.node.expression.left.object.name = "_localExports"
                            path.node.expression.left.property.name = "default"
                        }
                    if(path.node.expression.left.object.name === 'exports'){
                        path.node.expression.left.object.name = "_localExports"
                    }
                }
            }
        }})
    } 
    else if (dep instanceof EsModuleDependency){
        let exposedExports:t.ExpressionStatement[] = []
        let regularExports:t.ExpressionStatement[] = []

        traverse(ast,{
            ExportNamedDeclaration: function(path) {
                if(path.node.declaration !== null && path.node.declaration){
                    if(path.node.declaration.type !== 'Identifier' || path.node.specifiers.length === 0){
                        if(path.node.declaration.type === "VariableDeclaration"){
                            regularExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("_localExports"),t.identifier(path.node.declaration.declarations[0].id.name)),t.identifier(path.node.declaration.declarations[0].id.name))));
                            path.replaceWith(path.node.declaration);
                            return;
                        }

                        regularExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("_localExports"),t.identifier(path.node.declaration.id.name)),t.identifier(path.node.declaration.id.name))))
                        path.replaceWith(path.node.declaration)
                        return;
                    }
                    else{
                        regularExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("_localExports"),t.identifier(path.node.declaration.name)),t.identifier(path.node.declaration.name))))
                        path.remove()
                        return;
                    }
                } 
                else {
                    if (findVortexExpose(path.node)){
                        for(let exp of getExposures(path.node)){
                                exposedExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("exports"),t.identifier(exp)),t.identifier(exp))));
                            }
                            path.remove()
                        }
                    else{
                        for(let exp of path.node.specifiers){
                            if(exp.type === "ExportSpecifier"){
                                regularExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("_localExports"),t.identifier(exp.exported.name)),t.identifier(exp.local.name))));
                            }
                        }
                        path.remove();
                    }
                }

            },
            ExportDefaultDeclaration: function(path) {
                if(path.node.declaration.type !== 'Identifier'){
                    regularExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("_localExports"),t.identifier("default")),t.identifier(path.node.declaration.id.name))));
                    path.replaceWith(path.node.declaration);
                }
                else{
                    regularExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("_localExports"),t.identifier("default")),t.identifier(path.node.declaration.name))));
                    path.remove()
                }
            }
        })

        ast.program.body = ast.program.body.concat(regularExports);
        ast.program.body = ast.program.body.concat(exposedExports);

    }

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
    namespaceLibNames:string[] = []
    /**Array of compiled exposures (exports) */
    exports:Array<string> = [] 

    constructor(){}


    /**
     * Adds a CommonJS require entry to bundle libraries
     * @param {string} libname Name of library to add to requires 
     * @param {string} namespace Namespace applied to the entry 
     */

    addEntryToLibs(libname:string,namespace:string){
        this.namespaceLibNames.push(namespace);

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

function mangleVariableNamesFromAst(ast:t.File,impLocModules:Module[]){
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

/**
 * Compiles Graph into browser compatible application
 * @param {VortexGraph} Graph 
 * @returns {Object[]} WebApp Bundle
 */

async function WebAppCompile (Graph:VortexGraph,ControlPanel){

    class Shuttle {
        name:string
        entry:string
        buffer = t.objectExpression([])
    
        //[shuttle,_exports_]
    
        addModuleToBuffer(entry:string,evalModule:t.Statement|Array<t.Statement>){
            let func = t.functionExpression(null,[t.identifier('shuttle'),t.identifier('shuttle_exports'),t.identifier('gLOBAL_STYLES')],t.blockStatement(ControlPanel.isProduction ? evalModule : [evalModule]),false,false)
            this.buffer.properties.push(t.objectProperty(t.stringLiteral(entry),t.callExpression(t.identifier(''),[func])))
        }
    
        isInBuffer(entry:string){
            for(let ent of this.buffer.properties){
                if(ent.type === 'ObjectProperty'){
                    if(ent.key === t.stringLiteral(entry)){
                        return true
                    }
                }
            }
            return false
        }
    }

   let shuttle = new Shuttle();


   const BrowserGlobalTemplate = template('if(window.GLOBAL){shuttle_exports.MAPPED_DEFAULT = GLOBAL}',{placeholderWhitelist:new Set(['GLOBAL']),placeholderPattern:false})

   /**
    * Transformed Exports from File/lib
    */
   let transdExps:Array<string> = []
   /**
    * Resolved CSSs 
    */
   let resolveCSS:Array<string> = []
   /**
    * Resolved Files
    */
   let resolvedFiles:Array<string> = []

   //Transforms exports and Imports on all parsed Queue entries.

   var assetsFolder = './assets'

   var dir = LocalizedResolve(ControlPanel.outputFile,assetsFolder)

   // Transform Star

    for(let dep of Graph.Star){
        if(dep instanceof ModuleDependency){
            for(let impLoc of dep.importLocations){
                 TransformImportsFromAST(loadEntryFromQueue(impLoc.name).ast,impLoc,dep)
            }
            if(transdExps.includes(dep.name) == false && !dep.outBundle){
                 TransformExportsFromAST(loadEntryFromQueue(dep.name.includes('./') ? dep.name : dep.libLoc).ast,dep)
                transdExps.push(dep.name)
            } else if(dep.outBundle && transdExps.includes(dep.name) == false){
                let exportCheck = dep.importLocations.map(imploc => imploc.modules[0].name)
                let verify = _.uniq(exportCheck)
                if(verify.length === 1){
                    let ent = new QueueEntry(dep.name,t.file(t.program([BrowserGlobalTemplate({GLOBAL:t.identifier(verify[0])})]),null,null))
                    ent.external = true
                    addEntryToQueue(ent)
                    transdExps.push(dep.name)
                }
            }
        } else if(dep instanceof CSSDependency){
            if(resolveCSS.includes(dep.name) == false){
                let nCSS = await resolveCSSDependencies(dep,assetsFolder)
                resolveCSS.push(dep.name)
                dep.stylesheet = nCSS
            }
            if(ControlPanel.cssPlanet) {
                pipeCSSContentToBuffer(dep.stylesheet)
                for(let impLoc of dep.importLocations){
                    removeCSSImportsFromAST(loadEntryFromQueue(impLoc.name).ast,dep,impLoc)
                }
            }
            else{
                for(let impLoc of dep.importLocations){
                    injectCSSDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast,dep,impLoc)
                }
            }
        } else if(dep instanceof FileDependency){
            let outFile = ControlPanel.encodeFilenames? `${dep.uuid}${path.extname(dep.name)}` : path.basename(dep.name)
            let newName = `${dir}/${outFile}`
            let localNewName = `${assetsFolder}/${outFile}`
            if(resolvedFiles.includes(dep.name) == false){
                await fs.ensureDir(dir)
                await fs.copyFile(dep.name,newName)
                resolvedFiles.push(dep.name)
            }
            for(let impLoc of dep.importLocations){
                 resolveFileDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast,dep,impLoc,localNewName)
            }
        }else if(notNativeDependency(dep.name,ControlPanel)){
            let {importsTransformer,exportsTransformer} = resolveTransformersForNonNativeDependency(dep,ControlPanel)
            for(let impLoc of dep.importLocations){
                importsTransformer(loadEntryFromQueue(impLoc.name).ast,dep,impLoc)
            }
            // Node libraries are NATIVE ONLY therefore no need to verify if Dependency is a local file.
            exportsTransformer(loadEntryFromQueue(dep.name).ast,dep)
        }
    }

    // Transform Planets (Will crosscheck with already transformed files)

    for(let planet of Graph.Planets){
        //Transforms: import(**) to shuttle.planet(**) syntax
            for(let impLoc of planet.importedAt){
                // If current import location is NOT a cluster import
                if(!impLoc.clusterImport) {
                     TransformAsyncImportFromAST(loadEntryFromQueue(impLoc.name).ast,planet)
                }
            }

        if(transdExps.includes(planet.entryModule) == false){
            if(!notNativeDependency(planet.entryModule,ControlPanel)){
                TransformExportsFromAST(loadEntryFromQueue(planet.entryModule).ast,planet.entryDependency)
            } else{
                let {exportsTransformer} = resolveTransformersForNonNativeDependency(planet.entryDependency)
                exportsTransformer(loadEntryFromQueue(planet.entryModule).ast,planet.entryDependency)
            }
            transdExps.push(planet.entryModule)
        }
        
        for(let dep of planet.modules){
            if(dep instanceof ModuleDependency){
                for(let impLoc of dep.importLocations){
                     TransformImportsFromAST(loadEntryFromQueue(impLoc.name).ast,impLoc,dep)
                }
                if(transdExps.includes(dep.name) == false && !dep.outBundle){
                    TransformExportsFromAST(loadEntryFromQueue(dep.name.includes('./') ? dep.name : dep.libLoc).ast,dep)
                    transdExps.push(dep.name)
                } else if(dep.outBundle && transdExps.includes(dep.name) == false){
                    let exportCheck = dep.importLocations.map(imploc => imploc.modules[0].name)
                    let verify = _.uniq(exportCheck)
                    if(verify.length === 1){
                        let ent = new QueueEntry(dep.name,BrowserGlobalTemplate({GLOBAL:t.identifier(verify[0])}))
                        ent.external = true
                        addEntryToQueue(ent)
                        transdExps.push(dep.name)
                    }
                }
            } else if(dep instanceof CSSDependency){
                if(resolveCSS.includes(dep.name) == false){
                    let nCSS = await resolveCSSDependencies(dep,assetsFolder)
                    resolveCSS.push(dep.name)
                    dep.stylesheet = nCSS
                }
                if(ControlPanel.cssPlanet) {
                    pipeCSSContentToBuffer(dep.stylesheet)
                    for(let impLoc of dep.importLocations){
                        removeCSSImportsFromAST(loadEntryFromQueue(impLoc.name).ast,dep,impLoc)
                    }
                }
                else{
                    for(let impLoc of dep.importLocations){
                        injectCSSDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast,dep,impLoc)
                    }
                }
            } else if(dep instanceof FileDependency){
                let outFile = ControlPanel.encodeFilenames? `${dep.uuid}${path.extname(dep.name)}` : path.basename(dep.name)
                let newName = `${dir}/${outFile}`
                let localNewName = `${assetsFolder}/${outFile}`
                if(resolvedFiles.includes(dep.name) == false){
                    await fs.ensureDir(dir)
                    await fs.copyFile(dep.name,newName)
                    resolvedFiles.push(dep.name)
                }
                for(let impLoc of dep.importLocations){
                    resolveFileDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast,dep,impLoc,localNewName)
                }
            } else if(notNativeDependency(dep.name,ControlPanel)){
                let {importsTransformer,exportsTransformer} = resolveTransformersForNonNativeDependency(dep,ControlPanel)
                for(let impLoc of dep.importLocations){
                    importsTransformer(loadEntryFromQueue(impLoc.name).ast,dep,impLoc)
                }
                // Node libraries are NATIVE ONLY therefore no need to verify if Dependency is a local file.
                exportsTransformer(loadEntryFromQueue(dep.name).ast,dep)
            }
        }
    }

    //AMD Define Transform

    for(let planetClusterMapObj of Graph.PlanetClusterMap){
        for(let imploc of planetClusterMapObj.importedAt){
            TransformAsyncClusterImportFromAST(loadEntryFromQueue(imploc).ast,planetClusterMapObj)
        }
    }

    /**Names of ALL modules added to buffers. (Includes Planets)
     * 
     */
    let bufferNames:Array<string> = []

    //
    // Star Foldup.
    //

    // Pushes entrypoint into buffer to be compiled.

    const entry = loadEntryFromQueue(Graph.entryPoint)
    stripNodeProcess(entry.ast,ControlPanel)
    const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
    const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n  //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)})
    shuttle.addModuleToBuffer(Graph.entryPoint,mod)
    bufferNames.push(Graph.entryPoint)

    //Pushing modules into buffer to be compiled.



    for(let dep of Graph.Star){
        if(dep instanceof ModuleDependency){
            if(dep.libLoc !== undefined){
                    if(bufferNames.includes(dep.libLoc) == false){
                        const entry = loadEntryFromQueue(dep.libLoc)
                        if(entry.external) {
                            const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                            const mod = ControlPanel.isProduction? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code)})
                            shuttle.addModuleToBuffer(dep.libLoc,mod)
                            bufferNames.push(dep.libLoc)
                            continue;
                        }
                        stripNodeProcess(entry.ast,ControlPanel)
                        const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                        const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)})
                        shuttle.addModuleToBuffer(dep.libLoc,mod)
                        bufferNames.push(dep.libLoc)
                    }
                }
                else{
                    if(bufferNames.includes(dep.name) == false){
                        const entry = loadEntryFromQueue(dep.name)
                        if(entry.external) {
                            const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                            const mod = ControlPanel.isProduction? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code)})
                            shuttle.addModuleToBuffer(dep.name,mod)
                            bufferNames.push(dep.name)
                            continue;
                        }
                        stripNodeProcess(entry.ast,ControlPanel)
                        const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                        const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code  + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)})
                        shuttle.addModuleToBuffer(dep.name,mod)
                        bufferNames.push(dep.name)
                    }
                }
            }
            else if (notNativeDependency(dep.name,ControlPanel) && CustomDependencyIsBundlable(dep,ControlPanel)){
                if(bufferNames.includes(dep.name) == false){
                    const entry = loadEntryFromQueue(dep.name)
                    if(entry.external) {
                        const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                        const mod = ControlPanel.isProduction? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code)})
                        shuttle.addModuleToBuffer(dep.name,mod)
                        bufferNames.push(dep.name)
                        continue;
                    }
                    stripNodeProcess(entry.ast,ControlPanel)
                    const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                    const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code  + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)})
                    shuttle.addModuleToBuffer(dep.name,mod)
                    bufferNames.push(dep.name)
                }
            }
    }
    
    //
    // Planet Foldup
    //

    let PlanetShuttles:Array<Shuttle> = []

    
    for(let planet of Graph.Planets){
        let local_shuttle = new Shuttle()
        local_shuttle.name = planet.name
        local_shuttle.entry = planet.entryModule

        const entry = loadEntryFromQueue(planet.entryModule)
        stripNodeProcess(entry.ast,ControlPanel)
        const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
        const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)})
        local_shuttle.addModuleToBuffer(planet.entryModule,mod)
        bufferNames.push(planet.entryModule)

        //Pushing modules into buffer to be compiled.

        for(let dep of planet.modules){
            if(dep instanceof ModuleDependency){
                if(dep.libLoc !== undefined){
                        if(bufferNames.includes(dep.libLoc) == false){
                            const entry = loadEntryFromQueue(dep.libLoc)
                            if(entry.external) {
                                const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                                const mod = ControlPanel.isProduction? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code)})
                                local_shuttle.addModuleToBuffer(dep.libLoc,mod)
                                bufferNames.push(dep.libLoc)
                                continue;
                            }
                            stripNodeProcess(entry.ast,ControlPanel)
                            const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                            const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)})
                            local_shuttle.addModuleToBuffer(dep.libLoc,mod)
                            bufferNames.push(dep.libLoc)
                        }
                    }
                    else{
                        if(bufferNames.includes(dep.name) == false){
                            const entry = loadEntryFromQueue(dep.name)
                            if(entry.external) {
                                const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                                const mod = ControlPanel.isProduction? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code)})
                                local_shuttle.addModuleToBuffer(dep.name,mod)
                                bufferNames.push(dep.name)
                                continue;
                            }
                            stripNodeProcess(entry.ast,ControlPanel)
                            const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                            const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code + `\n //#sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)})
                            local_shuttle.addModuleToBuffer(dep.name,mod)
                            bufferNames.push(dep.name)
                        }
                    }
                }
                else if (notNativeDependency(dep.name,ControlPanel) && CustomDependencyIsBundlable(dep,ControlPanel)){
                    if(bufferNames.includes(dep.name) == false){
                        const entry = loadEntryFromQueue(dep.name)
                        if(entry.external) {
                            const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                            const mod = ControlPanel.isProduction? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code)})
                            local_shuttle.addModuleToBuffer(dep.name,mod)
                            bufferNames.push(dep.name)
                            continue;
                        }
                        const COMP = generate(entry.ast,{sourceMaps:true,sourceFileName:path.relative(path.dirname(ControlPanel.outputFile),entry.name)})
                        const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({CODE:t.stringLiteral(COMP.code  + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)})
                        local_shuttle.addModuleToBuffer(dep.name,mod)
                        bufferNames.push(dep.name)
                    }
                }
            }
        
        PlanetShuttles.push(local_shuttle)
    }




    /**
     * Factory Shuttle Module Loader (Vortex's Official Module Loader for the browser!)
     * If there are no planets, export top factory. IF there are, export bottom factory with Promises.
     */
    let factory = Graph.Planets.length === 0 ? `
    //Named Exports For Module
    var loadedModules = [];
    var loadedStyles = [];
    var loadedExportsByModule = {}; 
    //Shuttle Module Loader
    //Finds exports and returns them under fake namespace.
  
    function shuttle(mod_name) {
      //If module has already been loaded, load the exports that were cached away.
      if (loadedModules.includes(mod_name)) {
        return loadedExportsByModule[mod_name].cachedExports;
      } else {
        var mod = {
          exports: {}
        };
        modules[mod_name](shuttle, mod.exports,loadedStyles);
  
        var o = new Object(mod_name);
        if(mod.exports.MAPPED_DEFAULT){
            mod.exports = mod.exports.MAPPED_DEFAULT
        }
        Object.defineProperty(o, 'cachedExports', {
          value: mod.exports,
          writable: false
        });
        Object.defineProperty(loadedExportsByModule, mod_name, {
          value: o
        });
        loadedModules.push(mod_name);
        return mod.exports;
      }
    } 
    //Calls EntryPoint to Initialize

    ${ControlPanel.cssPlanet?`shuttle.cssPlanet = function(){
        var planetSrc = './${CSS_PLANET_ID}.css'
        var sheet = document.createElement('link')
        sheet.rel = "stylesheet"
        sheet.type = "text/css"
        sheet.href = planetSrc
        document.head.appendChild(sheet)
      }
  
      shuttle.cssPlanet()`: ''}
  
  
    return shuttle("${Graph.shuttleEntry}");` : `var loadedModules = [];
    var loadedStyles = [];
    var loadedExportsByModule = {}; 
  
    var loadedPlanets = [];
    var loadedPlanetEntryExports = {}
  
    var local_modules = modules
    
    //Shuttle Module Loader
    //Finds exports and returns them under fake namespace.
  
    function shuttle(mod_name) {
  
      //If module has already been loaded, load the exports that were cached away.
      if (loadedModules.includes(mod_name)) {
        return loadedExportsByModule[mod_name].cachedExports;
      } else {
        var mod = {
          exports: {}
        };
  
        local_modules[mod_name](shuttle, mod.exports, loadedStyles);
        var o = new Object(mod_name);
        if(mod.exports.MAPPED_DEFAULT){
            mod.exports = mod.exports.MAPPED_DEFAULT
        }
        Object.defineProperty(o, 'cachedExports', {
          value: mod.exports,
          writable: false
        });
        Object.defineProperty(loadedExportsByModule, mod_name, {
          value: o
        });
        loadedModules.push(mod_name);
        return mod.exports;
      }
    }
  
    // SML's version of ES Dynamic Import (Returns entry point module export of planet)
    
    shuttle.planet = function(planet_name) {
  
      return new Promise(function(resolve,reject){
          if(loadedPlanets.includes(planet_name)){
              resolve(loadedPlanetEntryExports[planet_name].cachedExports);
          }
          else{
              var planet = document.createElement('script');
              planet.src = planet_name;
              document.body.appendChild(planet);
              planet.addEventListener('load',function(){
                  planetLoaded().then(
                      function(exports){
                          loadedPlanets.push(planet_name);
                          var o = new Object(planet_name);
                          Object.defineProperty(o, 'cachedExports', {
                              value: exports,
                              writable: false
                          });
                          Object.defineProperty(loadedPlanetEntryExports, planet_name, {
                              value: o
                          });
                          resolve(exports);
                      })
              },false)
  
              var entryPoint
  
              function planetLoaded(){
                  return new Promise(function(resolve,reject){
                      console.log('Loading from '+planet_name);
                      shuttle.override(planetmodules);
                      entryPoint = entry;
                      resolve(shuttle(entryPoint));
                  })
              }
  
          }
      })
  
        
    }
  
    shuttle.override = function(mods){
        local_modules = mods
    }

    shuttle.planetCluster = function(planets_array,callback){
        function defineCluster(){
          return new Promise(function(resolve, reject){
              var moduleObjects = planets_array.map(function(planet) { return shuttle.planet(planet)})
              Promise.all(moduleObjects).then(function(module_objs) {
                  resolve(module_objs)
              })
          })
      }
        defineCluster().then(function (moduleObjects) {
            callback.apply(null,moduleObjects)
        })
    }

    //AMD Registration Object!

    shuttle.planetCluster.amdRegistrar = {};
    
    
    
    //Calls EntryPoint to Initialize

    ${ControlPanel.cssPlanet?`shuttle.cssPlanet = function(){
        var planetSrc = './${CSS_PLANET_ID}.css'
        var sheet = document.createElement('link')
        sheet.rel = "stylesheet"
        sheet.type = "text/css"
        sheet.href = planetSrc
        document.head.appendChild(sheet)
      }
  
      shuttle.cssPlanet()`: ''}
  
  
    return shuttle("${Graph.shuttleEntry}");`;

    let parsedFactory = Babel.parse(factory,{allowReturnOutsideFunction:true}).program.body

    let finalCode = generate(t.expressionStatement(t.callExpression(t.identifier(''),[t.callExpression(t.functionExpression(null,[t.identifier("modules")],t.blockStatement(parsedFactory),false,false),[shuttle.buffer])])),{compact: ControlPanel.isProduction? true : false}).code;
    
    if(ControlPanel.cssPlanet){
        await writeCSSPlanet(cssStorage,ControlPanel);
    }

    let codeEntries:Array<Bundle> = []

    let o:Bundle = {value:'star',code:finalCode};

    codeEntries.push(o)

    for(let _shuttle of PlanetShuttles){

        let code = generate(t.program([t.variableDeclaration('var',[t.variableDeclarator(t.identifier('entry'),t.stringLiteral(_shuttle.entry)),t.variableDeclarator(t.identifier('planetmodules'),_shuttle.buffer)])]),{compact: ControlPanel.isProduction? true : false}).code

        let o:Bundle = {value:_shuttle.name,code:code}
        
        codeEntries.push(o)
    }


    return codeEntries


}

//Shuttle Module Templates:


/**
 * Vortex's Require Function Template
 */
const ShuttleInitialize = template("MODULE = shuttle(MODULENAME)")
/**
 * Vortex's Named Export Template
 */
const ShuttleExportNamed = template("shuttle_exports.EXPORT = LOCAL")
/**
 * Vortex's Default Export Template
 */
const ShuttleExportDefault = template("shuttle_exports.default = EXPORT")

/**
 * Compiles imports from the provided AST into the Shuttle Module Loader format.
 * 
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {MDImportLocation} currentImpLoc The Current ModuleDependency Import Location 
 * @param {ModuleDependency} dep The current ModuleDependency.
 */

export function TransformImportsFromAST(ast:t.File,currentImpLoc:MDImportLocation,dep:ModuleDependency){

    let namespace = `VORTEX_MODULE_${fixDependencyName(dep.name)}`

    if(dep instanceof EsModuleDependency){
            traverse(ast,{
                ImportDeclaration: function(path){
                    if(path.node.source.value === currentImpLoc.relativePathToDep){
                        if(dep.name.includes('./')){
                            // Uses dep name as replacement module source
                            path.replaceWith(t.variableDeclaration('var',[t.variableDeclarator(t.identifier(namespace),t.callExpression(t.identifier('shuttle'),[t.stringLiteral(dep.name)]))]))
                        } else{
                            //Search for lib bundle if lib
                            path.replaceWith(t.variableDeclaration('var',[t.variableDeclarator(t.identifier(namespace),t.callExpression(t.identifier('shuttle'),[t.stringLiteral(dep.libLoc)]))]))
                        }
                    }
                },
                Identifier: function(path){
                    if(path.parent.type !== 'MemberExpression' && path.parent.type !== 'ImportSpecifier' && path.parent.type !== 'ImportDefaultSpecifier' && path.parent.type !== 'ObjectProperty'){

                            if(currentImpLoc.indexOfModuleByName(path.node.name) !== null){
                                if(dep.name.includes('./') == false){
                                    //If library but NOT default import from lib
                                    if(currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type !== ModuleTypes.EsDefaultModule && currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type !== ModuleTypes.EsDefaultNamespaceProvider){
                                        path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier(path.node.name)))
                                    }else if(currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type === ModuleTypes.EsDefaultModule || currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type === ModuleTypes.EsDefaultNamespaceProvider){
                                        path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier('default')))
                                    }
                                    //if NOT library at all
                                } else{
                                    //If Object Property, replace with module Object Namespace
                                    if(currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type === ModuleTypes.EsDefaultModule){
                                        path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier('default')))
                                    }
                                    else{
                                        path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier(path.node.name)))
                                    }
                                }
                            }
                        }
                    },
                //Reassigns lib default namespace to vortex namespace
                MemberExpression: function(path){
                    if(dep.name.includes('./') == false){
                        if(path.node.object.type === 'Identifier'){
                            if(currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.object.name)] !== undefined){
                                // Only passes through here namespace IS the default module.
                                let defaultMod = currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.object.name)]
                                if(defaultMod.type === ModuleTypes.EsDefaultModule && defaultMod.name === path.node.object.name){
                                    path.replaceWith(t.memberExpression(t.identifier(namespace),path.node.property))
                                } else if(defaultMod.type === ModuleTypes.EsDefaultNamespaceProvider && defaultMod.name === path.node.object.name){
                                    // IF Namespace is the default export and is used as new or call expression elsewhere.
                                    path.replaceWith(t.memberExpression(t.memberExpression(t.identifier(namespace),t.identifier('default')),path.node.property))
                                }
                            }
                        }
                    }
                },
                ObjectProperty: function(path){
                    if(path.node.value.type === "Identifier"){
                        if(currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.value.name)] !== undefined){
                            if(path.node.value.name === currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.value.name)].name){
                                path.node.value.name = namespace
                            }
                        }
                    }
                }
            })
        } else if(dep instanceof CjsModuleDependency){

            if(currentImpLoc.modules[0].type === ModuleTypes.CjsNamespaceProvider || currentImpLoc.modules[0].type === ModuleTypes.CjsInteropRequire){
                traverse(ast,{
                    VariableDeclaration: function(path){
                        for(let dec of path.node.declarations){
                            if(dec.init !== null){
                                if(dec.init.type === 'CallExpression'){
                                    if(dec.init.callee.name === 'require' && dec.init.arguments[0].value === currentImpLoc.relativePathToDep){
                                        dec.id.name = namespace
                                        dec.init.callee.name = 'shuttle'
                                        dec.init.arguments[0].value = dep.name.includes('./')? dep.name : dep.libLoc
                                    } else if (dec.init.callee.type === 'Identifier' && dec.init.callee.name === '_interopDefault' && dec.init.arguments[0].type === 'CallExpression' && dec.init.arguments[0].callee.name === 'require' && dec.init.arguments[0].arguments[0].value === currentImpLoc.relativePathToDep){
                                        dec.init.arguments[0].callee.name = 'shuttle'
                                        dec.id.name = namespace
                                        dec.init.arguments[0].arguments[0].value = dep.name.includes('./')? dep.name : dep.libLoc
                                    }
                                }
                            }
                        }
                    },
                    MemberExpression: function(path){
                        //Replaces CommonJs Namespaces if library does NOT have default export.
                        if(path.parent.type === 'ObjectProperty'){
                            if(path.node.name !== path.parent.key && path.node === path.parent.value){
                                if(path.node.object.name === currentImpLoc.modules[0].name && path.node.property !== null){
                                    path.replaceWith(t.memberExpression(t.identifier(namespace),path.node.property))
                                }
                            }
                        }
                        else if(path.node.object.type === 'Identifier'){
                            if(path.node.object.name === currentImpLoc.modules[0].name && path.node.property !== null){
                                path.replaceWith(t.memberExpression(t.identifier(namespace),path.node.property))
                            }
                        }
                    },
                    Identifier: function(path){
                        if(path.parent.type === 'ObjectProperty'){
                            if(path.node.name !== path.parent.key && path.node === path.parent.value){
                                if(path.node.name === currentImpLoc.modules[0].name){
                                    path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier('default')))
                                }
                            }
                        }
                        //Replaces CommonJs Namespace if library DOES have default export.
                        else if(path.parent.type !== 'MemberExpression' && path.parent.type !== 'VariableDeclarator' && path.parent.type !== 'FunctionDeclaration'){
                            if(path.node.name === currentImpLoc.modules[0].name){
                                if(path.parent.type === 'CallExpression' && path.node.name === path.parent.callee.name){
                                    path.replaceWith(t.memberExpression(t.identifier(namespace),t.identifier('default')))
                                } else{
                                    //IF there is not functionality whatsoever to this identifier, replace it with the namespace
                                    path.node.name = namespace
                                }
                            }
                        }
                    }
                })
            }

        }
}

/**Compiles exports from the provided AST into the Shuttle Module Loader format.
 * 
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {ModuleDependency} dep The Current ModuleDependency 
 */


export function TransformExportsFromAST(ast:t.File,dep:ModuleDependency){
    //Removes exports from local file ES Modules only.
    if(dep instanceof EsModuleDependency && dep.libLoc == null){
        let exportsToBeRolled:Array<string> = []
        let defaultExport:string
        traverse(ast,{
            ExportNamedDeclaration: function(path){
                if(path.node.declaration !== undefined && path.node.declaration !== null){
                    if(path.node.declaration.type === 'FunctionDeclaration'){
                        exportsToBeRolled.push(path.node.declaration.id.name)
                    }
                    else if(path.node.declaration.type === 'VariableDeclaration'){
                        exportsToBeRolled.push(path.node.declaration.declarations[0].id.name)
                    }

                    path.replaceWith(path.node.declaration)
                }
                else{
                    for(let exp of path.node.specifiers){
                        if(exp.type === 'ExportSpecifier'){
                            if(exp.exported.name === 'default'){
                                defaultExport = exp.local.name
                            }
                            else{
                                exportsToBeRolled.push(exp.exported.name)
                            }
                        }
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
                path.replaceWith(path.node.declaration)
            }
        })
        //Rolls out/Converts exports to be read by Shuttle Module Loader
        for(let expo of exportsToBeRolled){
            ast.program.body.push(ShuttleExportNamed({EXPORT:expo, LOCAL:expo}))
        }
        //Pushes/converts default export ONLY if it exists be read by Shuttle Module Loader
        if(defaultExport !== undefined){
            ast.program.body.push(ShuttleExportDefault({EXPORT:defaultExport}))
        }
    }
    //Will rewrite exports for not only CJS dependencies but for Node Modules all together.
    else if (dep instanceof CjsModuleDependency || dep.libLoc !== null){
        traverse(ast,{
            AssignmentExpression: function(path){
                    if(path.node.left.type === 'MemberExpression'){
                        if(path.node.left.object.type === 'Identifier'){
                            //Looks for CommonJs named exports
                            if(path.node.left.object.name === 'exports'){
                                path.replaceWith(ShuttleExportNamed({EXPORT:path.node.left.property.name,LOCAL:path.node.right}))
                            }
                            else if(path.node.left.object.name === 'module' && path.node.left.property.name === 'exports'){
                                path.replaceWith(ShuttleExportDefault({EXPORT:path.node.right.type === 'Identifier' ? path.node.right.name : path.node.right}))

                            } else if(path.node.left.object.name === 'freeModule' && path.node.left.property.name === 'exports'){
                                //Vue.js template compiler polyfill fix.. (For dependency 'he')
                                path.node.left.property.name = 'default'
                            }
                        }
                    }
                },
            MemberExpression: function(path){
                if(path.parent.type !== 'AssignmentExpression'){
                    if(path.node.object.type === 'Identifier'){
                        if(path.node.object.name === 'exports'){
                            path.node.object.name = 'shuttle_exports'
                        } else if(path.node.object.name === 'module'){
                            path.node.object.name = 'shuttle_exports'
                            if(path.node.property.name === 'exports'){
                                path.node.property.name = 'default'
                            }
                        }
                    }
                }
            },
            Identifier: function(path){
                if(path.parent.type !== 'MemberExpression'){
                    if(path.node.name === 'exports'){
                        path.node.name = 'shuttle_exports'
                    } else if(path.node.name === 'module'){
                        path.node.name = 'shuttle_exports'
                    }
                }
            }
        })
    }
}

/** 
 * 
 * Strips process.node functions/conditionals from the code. (Also strips Object.defineProperty(exports,_esModule))
 * 
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 */

function stripNodeProcess(ast:t.File,ControlPanel){
    traverse(ast,{
        CallExpression: function(path){
            if(path.node.callee.type === 'MemberExpression' && path.node.callee.object.type === "Identifier" && path.node.callee.object.name === 'Object' && path.node.callee.property.name === 'defineProperty' && path.node.arguments[0].type === 'Identifier' && path.node.arguments[0].name === 'exports'){
                path.remove()
            }
        },
        MemberExpression: function(path){
            if(path.node.object.type === 'Identifier' && path.node.object.name === 'process' && path.node.property.name === 'env'){
                path.replaceWith(t.stringLiteral(ControlPanel.isProduction? 'production' : 'development'))
            } else if(path.node.object.type === 'MemberExpression' && path.node.object.object.type === 'Identifier' && path.node.object.object.name === 'process' && path.node.object.property.name === 'env' && path.node.property.name === 'NODE_ENV'){
                path.replaceWith(t.stringLiteral(ControlPanel.isProduction? 'production' : 'development'))
            }
        }
    })
}

export const CSSInjector = template("if(!gLOBAL_STYLES.includes(DEPNAME)){var style = document.createElement('style'); style.innerHTML=CSS;document.head.appendChild(style);gLOBAL_STYLES.push(DEPNAME)}")

/**Injects CSS into import location
 * 
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {CSSDependency} dep CSS Dependency
 * @param {FileImportLocation} currentImpLoc CUrrent File Import Location
 */

function injectCSSDependencyIntoAST(ast:t.File,dep:CSSDependency,currentImpLoc:FileImportLocation){
    traverse(ast,{
        ImportDeclaration: function(path){
            if(path.node.source.value === currentImpLoc.relativePathToDep){
                path.replaceWith(CSSInjector({DEPNAME:t.stringLiteral(dep.name),CSS:t.stringLiteral(dep.stylesheet)}))
            }
        }
    })
}

function removeCSSImportsFromAST(ast:t.File,dep:CSSDependency,currentImpLoc:FileImportLocation){
    traverse(ast,{
        ImportDeclaration: function(path){
            if(path.node.source.value === currentImpLoc.relativePathToDep){
                path.remove()
            }
        }
    })
}

/**Resolves File Dependency name with new name from a given AST.
 * 
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {FileDependency} dep Dependency to resolve
 * @param {FileImportLocation} currentImpLoc Current Import Location
 * @param {string} newFileName New name to resolve dependency under
 */

function resolveFileDependencyIntoAST(ast:t.File,dep:FileDependency,currentImpLoc:FileImportLocation,newFileName:string){

    traverse(ast,{
        ImportDeclaration: function(path){
            if(path.node.source.value === currentImpLoc.relativePathToDep){
                path.replaceWith(t.variableDeclaration('var',[t.variableDeclarator(t.identifier(currentImpLoc.localName),t.stringLiteral(newFileName))]))
            }
        },
        CallExpression: function(path){
            if(path.node.callee.type === 'Identifier' && path.node.callee.name === 'require' && path.node.arguments[0].value === currentImpLoc.relativePathToDep){
                path.replaceWith(t.stringLiteral(newFileName))
            }
        }
    })
}

/**Similar to {@link resolveFileDependencyIntoAST}, but only applies for CSS files. 
 * 
 * 
 * @param {css.Stylesheet} ast Abstract Syntax Tree (CSS Parser Format) 
 * @param {string} fileDep 
 * @param {string} newName 
 */

function replaceFileDependencyIntoCSS(ast:css.Stylesheet,fileDep:string,newName:string){

    for(let rule of ast.stylesheet.rules){
        if(rule.type === 'font-face'){ 
            for(let dec of rule.declarations){
                if(dec.property === 'src' && dec.value.includes(path.basename(fileDep))){
                    let a = dec.value.slice(0,4)
                    let b = dec.value.slice(dec.value.indexOf(')'))
                    dec.value = `${a}'${newName}'${b}`
                }
            }
        }
    }

}

/**Resolves/Transforms CSS's Dependencies.
 * 
 * @param {CSSDependency} dep 
 * @param {string} assets_folder 
 */

async function resolveCSSDependencies(dep:CSSDependency,assets_folder:string){

    let parsedCss = css.parse(dep.stylesheet)

    let outputDest = LocalizedResolve(ControlPanel.outputFile,assets_folder)

    await fs.ensureDir(outputDest)


    for(let d of dep.dependencies){
        if(d instanceof FileDependency){
            let outFile = ControlPanel.encodeFilenames? `${d.uuid}${path.extname(d.name)}` : path.basename(d.name)
            let newName = `${assets_folder}/${outFile}`
            await fs.copyFile(d.name,`${outputDest}/${outFile}`)
            replaceFileDependencyIntoCSS(parsedCss,d.name,newName)
        }
    }

    return css.stringify(parsedCss)

}

/**Transforms Async Import (ES Dynamic Import Syntax) to be used by Shuttle Module Loader
 * @example
 * 
 * import('module') // Into This -->
 * 
 * shuttle.planet('planet.js')
 * 
 * 
 * @param {t.File} ast Abstract Syntax Tree 
 * @param {Planet} planet 
 */


function TransformAsyncImportFromAST(ast:t.File,planet:Planet){

    traverse(ast,{
        CallExpression: function(path){
            if(path.node.callee.type === "Import" && path.node.arguments[0].value === planet.originalName){
                path.replaceWith(t.callExpression(t.memberExpression(t.identifier("shuttle"),t.identifier("planet")),[t.stringLiteral(planet.name)]))
            }
        }
    })
}

/**Transforms AMD Define to be used by SML
 * 
 * @example
 * 
 * //Transforms
 * define(['module0','module1'],function(module0Object,module1Object){
 * // Access Module Exports Here!
 * })
 * //To --> 
 * shuttle.planetCluster(['planet_0.js','planet_1.js'],function(module0Object,module1Object){
 * // Access Module Exports Here!
 * })
 * 
 * 
 * 
 * @param {t.File} ast 
 * @param {PlanetClusterMapObject} planetClusterMap 
 */

function TransformAsyncClusterImportFromAST(ast:t.File,planetClusterMap:PlanetClusterMapObject){
    traverse(ast, {
        CallExpression: function(path){
            if(path.node.callee.type === 'Identifier' && path.node.callee.name === 'define' && path.node.arguments[0].type === 'ArrayExpression') {
                let args:Array<string> = path.node.arguments[0].elements.map(argumnt => argumnt.value)
                // If there is NO difference between args and module names.
                if(_.difference(args,planetClusterMap.planetsByOriginalName).length === 0){
                    //Converts strings to Stringliterals
                    let planetNameNodes:Array<t.StringLiteral> = planetClusterMap.planetsByNewName.map(value => t.stringLiteral(value))
                    path.replaceWith(t.callExpression(t.memberExpression(t.identifier("shuttle"),t.identifier("planetCluster")),[t.arrayExpression(planetNameNodes),path.node.arguments[1]]))
                }
            }
        }
    })

}

async function writeCSSPlanet(stylesheetBuffer:Array<string>,ControlPanel){
    let cssPlanetLoc = LocalizedResolve(ControlPanel.outputFile,`./${CSS_PLANET_ID}.css`)
    let OUT_STYLESHEET = stylesheetBuffer.join('')
    if(ControlPanel.minifyCssPlanet) {
        OUT_STYLESHEET = await minifyCss(OUT_STYLESHEET)
    }
    await FS.writeFile(cssPlanetLoc,OUT_STYLESHEET);
}

async function minifyCss(styles:string) {

    let regexp = /(\s*|(\n)*|(\r\n)*)/g
    return styles.replace(regexp,"");
}




