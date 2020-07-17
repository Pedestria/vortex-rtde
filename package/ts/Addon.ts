import * as VortexAPI from './API'
import * as t from '@babel/types'
import * as _ from 'lodash'
import { string } from 'yargs'
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

export class ExportsHandler {

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

export interface CustomGraphDependencyMapObject {
    extension:string
    dependency:DependencyConstructor
    bundlable:boolean
}

export interface CustomDependencyGrapher {
    name:string 
    grapher:Grapher
}

export interface Transformer{

    (AST:t.File,Dependency:VortexAPI.Dependency):void

}

export interface ImportsTransformer{

    (AST:t.File,Dependency:VortexAPI.Dependency,CurrentImportLocation:VortexAPI.ImportLocation):void

}

export interface CompilerCustomDependencyMap {
    extname:string
    importsTransformer:ImportsTransformer
    exportsTransformer:Transformer
}

export interface VortexAddonModule extends Object {
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


export interface InternalVortexAddons{
    extensions:{
        js:Array<string>
        other:Array<string>
    }
    importedDependencies:Array<CustomGraphDependencyMapObject>
    importedGraphers:Array<CustomDependencyGrapher>
    importedCompilers:Array<CompilerCustomDependencyMap>
}

export interface Grapher {
    /**
     * Construct Grapher with Dependency Input.
     * Often used with Precompilers.
     */
    (Dependency:VortexAPI.Dependency,Graph:VortexAPI.VortexGraph,planetName?:string):Promise<void>
    /**
     * Construct Grapher with Queue Entry Input
     */
    // (QueueEntry:VortexAPI.QueueEntry,Graph:VortexAPI.VortexGraph):void

}


type DependencyConstructor = 
{new (name:string,initImportLocation:VortexAPI.ImportLocation):VortexAPI.Dependency }| 
{new (name:string,initImportLocation:VortexAPI.FileImportLocation,stylesheet:string):VortexAPI.CSSDependency}
