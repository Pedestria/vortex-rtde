import Dependency from './Dependency'
import ImportLocation from './ImportLocation'
import ModuleDependency from './dependencies/ModuleDependency'
import MDImportLocation from './importlocations/MDImportLocation'
import { QueueEntry, addEntryToQueue, loadEntryFromQueue } from './GraphGenerator'
import traverse from '@babel/traverse'
import { VortexGraph } from './Graph'
import { transformAsync} from '@babel/core'
import { BabelSettings, ParseSettings } from './Options'
import { GraphDepsAndModsForCurrentFile } from './GraphGenerator'
import generate from '@babel/generator'
import {parse} from '@babel/parser'
import {TransformImportsFromAST, TransformExportsFromAST, CSSInjector, pipeCSSContentToBuffer} from './Compiler'
import EsModuleDependency from './dependencies/EsModuleDependency'
import {CSSDependency} from './dependencies/CSSDependency'
import {FileImportLocation} from './importlocations/FileImportLocation'
import {ControlPanel} from './Main'

function BabelCompile(code: string) {
    return transformAsync(code, BabelSettings)
}

import * as t from '@babel/types'
import * as _ from 'lodash'
/**
 * Vortex Addon Interface
 */
class VortexAddon {

    name:string
    handler:ExportsHandler
    /**
     * 
     * @param {string} name Addon Name
     */
    constructor(name:string, handler:ExportsHandler){
        this.name = name;
        this.handler = handler
    }
} 

class ExportsHandler {

   exports:ExportHandlerMap = {
       extend: {
           jsExtensions:[],
           extensions:[],
           custom:{
               graph:{
                   graphers:[],
                   dependenciesMap:[],
               },
               compiler:{
                   dependencyMapCompiler:[]
               },
               livePush:{}
           }
       },
       override:{
           compileExtensions:[],
           livePushExtensions:[]
       }
   }

    /**Register addon functionality
     * 
     * @param {VortexAddonModule} moduleObject 
     */

    register(moduleObject:VortexAddonModule){
        for(let [key,value] of Object.entries(moduleObject)){
            switch(key){
                case 'JS_EXNTS':
                    this.exports.extend.jsExtensions = _.concat(value)
                    break;
                case 'NON_JS_EXNTS':
                    this.exports.extend.extensions = _.concat(value)
                    break;
                case 'GRAPH_EXTSN':
                    this.exports.extend.custom.graph.graphers = _.concat(value)
                    break;
                case 'CUSTOM_DEPENDENCIES':
                    this.exports.extend.custom.graph.dependenciesMap = _.concat(value)
                    break;
                case 'COMPILER_EXTSN':
                    this.exports.extend.custom.compiler.dependencyMapCompiler = _.concat(value)
            }
        }
    }


}

interface CustomGraphDependencyMapObject {
    extension:string
    dependency:DependencyConstructor<VAbstractDependencies>,
    bundlable:boolean
}

interface CustomDependencyGrapher {
    name:string 
    grapher:Grapher
}

interface ExportsTransformer{

    (AST:t.File,Dependency:Dependency):void

}

interface ImportsTransformer{

    (AST:t.File,Dependency:Dependency,CurrentImportLocation:ImportLocation):void

}

interface CompilerCustomDependencyMap {
    extname:string
    importsTransformer:ImportsTransformer
    exportsTransformer:ExportsTransformer
}

export interface VortexAddonModule {
    JS_EXNTS:Array<string>
    NON_JS_EXNTS:Array<string>
    GRAPH_EXTSN:Array<CustomDependencyGrapher>
    CUSTOM_DEPENDENCIES:Array<CustomGraphDependencyMapObject>
    COMPILER_EXTSN:Array<CompilerCustomDependencyMap>

}

interface ExportHandlerMap {
    extend: {
        jsExtensions:Array<string>
        extensions:Array<string>
        custom: {
            graph: {
                graphers:Array<CustomDependencyGrapher>
                dependenciesMap:Array<CustomGraphDependencyMapObject>
            }
            compiler : {
                dependencyMapCompiler:Array<CompilerCustomDependencyMap>
            }
            livePush: {

            }
        }
    }
    override: {
        compileExtensions: {
            jsExtension:boolean
            extension:string
            compiler:Function
        }[]
        livePushExtensions: {
            jsExtension:boolean
            extension:string
            compiler:Function
        }[]
    }

}


interface Grapher {
    /**
     * Construct Grapher with Dependency Input.
     * Often used with Precompilers.
     */
    (Dependency:Dependency,Graph:VortexGraph,planetName?:string,ControlPanel):Promise<void>
    /**
     * Construct Grapher with Queue Entry Input
     */
    // (QueueEntry:QueueEntry,Graph:VortexGraph):void

}

declare namespace Addons {

    export {
        VortexAddon,
        ExportsHandler,
        CustomGraphDependencyMapObject,
        CustomDependencyGrapher,
        ExportsTransformer,
        ImportsTransformer,
        CompilerCustomDependencyMap,
        VortexAddonModule,
        Grapher
    }

}

interface InternalVortexAddons{
    extensions:{
        js:Array<string>
        other:Array<string>
    }
    importedDependencies:Array<CustomGraphDependencyMapObject>
    importedGraphers:Array<CustomDependencyGrapher>
    importedCompilers:Array<CompilerCustomDependencyMap>
}


type DependencyConstructor<T> = T extends CSSDependency?{new(name:string,initImportLocation:FileImportLocation,stylesheet:string):CSSDependency} :
T extends Dependency?{new(name:string,initImportLocation:ImportLocation):Dependency} : never

type VAbstractDependencies = Dependency|CSSDependency|ModuleDependency

declare namespace VortexRTDEAPI{
    export {
        Dependency,
        ImportLocation,
        ModuleDependency,
        CSSDependency,
        MDImportLocation,
        QueueEntry,
        traverse as TraverseCode,
        parse as ParseCode,
        VortexGraph,
        BabelCompile,
        GraphDepsAndModsForCurrentFile as NativeDependencyGrapher,
        generate as GenerateCode,
        TransformImportsFromAST as TransformNativeImports,
        TransformExportsFromAST as TransformNativeExports,
        CSSInjector as InjectCSS,
        addEntryToQueue as addQueueEntry,
        EsModuleDependency,
        loadEntryFromQueue as loadQueueEntry,
        FileImportLocation,
        pipeCSSContentToBuffer,
        Addons,
        t as ESTreeTypes  
    }
}

export default VortexRTDEAPI;
