import Dependency from './Dependency'
import ImportLocation from './ImportLocation'
import ModuleDependency from './dependencies/ModuleDependency'
import MDImportLocation from './importlocations/MDImportLocation'
import { QueueEntry, addEntryToQueue, loadEntryFromQueue, GraphDepsAndModsForCurrentFile } from './GraphGenerator'
import traverse from '@babel/traverse'
import { VortexGraph } from './Graph'
import { transformAsync} from '@babel/core'
import { BabelSettings, ParseSettings } from './Options'
import generate from '@babel/generator'
import {parse} from '@babel/parser'
import {TransformImportsFromAST, TransformExportsFromAST, CSSInjector, pipeCSSContentToBuffer} from './Compiler'
import EsModuleDependency from './dependencies/EsModuleDependency'
import {CSSDependency} from './dependencies/CSSDependency'
import {FileImportLocation} from './importlocations/FileImportLocation'

function BabelCompile(code: string) {
    return transformAsync(code, BabelSettings)
}

import * as t from '@babel/types'
import * as _ from 'lodash'
/**
 * Vortex Addon Interface
 */
export class VortexAddon {

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
               livePush:{
                   customBranches:[]
               }
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
                    break;
                case 'CUSTOM_BRANCHES':
                    this.exports.extend.custom.livePush.customBranches = _.concat(value)
                    break;
            }
        }
    }


}

interface CustomGraphDependencyMapObject {
    extension:string
    dependency:DependencyConstructor<typeof Dependency>,
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

interface VortexAddonModule {
    JS_EXNTS:Array<string>
    NON_JS_EXNTS:Array<string>
    GRAPH_EXTSN:Array<CustomDependencyGrapher>
    CUSTOM_DEPENDENCIES:Array<CustomGraphDependencyMapObject>
    COMPILER_EXTSN:Array<CompilerCustomDependencyMap>
    CUSTOM_BRANCHES:Array<CustomBranchObject>
}

interface CustomBranchObject {
    ext:string
    type:"Module"|"CSS"
    precompiler:CustomPreCompiler
}

type CustomPreCompiler = (filename:string) => Promise<void>;

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
                customBranches:Array<CustomBranchObject>
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

interface ControlPanel {

    /**
     * If checked True, then Vortex will bundle with NO debug tools.
     * If checked False, then Vortex will bundle with debug tools.
     */
    isProduction:boolean
    /**
     * If checked true, Vortex will consider your program a library instead of a web application.
     */
    isLibrary:boolean
    /**
     * If checked true, Terser will be used to minify production bundle. (Can NOT be used on development bundles.) (Labels it Neutron Star)
     */
    usingTerser:boolean

    outputFile:string

    /**If checked true, Vortex will encode File Dependency names with uuids.
     */
      encodeFilenames:boolean

      useDebug:boolean;

      startingPoint:string

      extensions:Array<string>

      polyfillPromise:boolean

      externalLibs:Array<string>

      InstalledAddons:InternalVortexAddons

      cssPlanet:boolean

      minifyCssPlanet:boolean

}


interface Grapher {
    /**
     * Construct Grapher with Dependency Input.
     * Often used with Precompilers.
     */
    (Dependency:Dependency,Graph:VortexGraph,planetName:string,ControlPanel:ControlPanel):Promise<void>
    /**
     * Construct Grapher with Queue Entry Input
     */
    // (QueueEntry:QueueEntry,Graph:VortexGraph):void

}

var Addons = {

    VortexAddon:VortexAddon,
    ExportsHandler:ExportsHandler,
}

export interface InternalVortexAddons{
    extensions:{
        js:Array<string>
        other:Array<string>
    }
    importedDependencies:Array<CustomGraphDependencyMapObject>
    importedGraphers:Array<CustomDependencyGrapher>
    importedCompilers:Array<CompilerCustomDependencyMap>
}

type DependencyConstructor<T extends typeof Dependency> = InstanceType<T>




type VAbstractDependencies = Dependency|CSSDependency|ModuleDependency

declare namespace VortexAPI {
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

export var VortexRTDEAPI:typeof VortexAPI = {
        Dependency:Dependency,
        ImportLocation:ImportLocation,
        ModuleDependency:ModuleDependency,
        CSSDependency:CSSDependency,
        MDImportLocation:MDImportLocation,
        QueueEntry:QueueEntry,
        TraverseCode:traverse,
        ParseCode:parse,
        VortexGraph:VortexGraph,
        BabelCompile:BabelCompile,
        NativeDependencyGrapher:GraphDepsAndModsForCurrentFile,
        GenerateCode:generate,
        TransformNativeImports:TransformImportsFromAST,
        TransformNativeExports:TransformExportsFromAST,
        InjectCSS:CSSInjector,
        addQueueEntry:addEntryToQueue,
        EsModuleDependency:EsModuleDependency,
        loadQueueEntry:loadEntryFromQueue,
        FileImportLocation:FileImportLocation,
        pipeCSSContentToBuffer:pipeCSSContentToBuffer,
        Addons:Addons,
        ESTreeTypes:t  
};
