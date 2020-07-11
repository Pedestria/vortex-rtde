import * as VortexAPI from './API'
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

export class ExportsHandler {

   exports:ExportHandlerMap = {
       extend: {
           jsExtensions:[],
           extensions:[],
           custom:{
               graph:{
                   dependencies:[],
                   dependencyMapExposeExports:[]
               },
               compiler:{
                   dependencies:[],
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
            }
        }
    }


}

interface GraphReturnExportsMapObject {
    name:string 
    returnExports:boolean
}

interface Transformer extends Function {

    AST:t.File
    Dependency:VortexAPI.Dependency

}

interface ImportsTransformer extends Transformer {
    CurrentImportLocation:VortexAPI.ImportLocation
}

interface CompilerCustomDependencyMap {
    name:string
    importsTransformer:ImportsTransformer
    exportsTransformer:Transformer
}

export interface VortexAddonModule extends Object {
    JS_EXNTS:Array<string>
    NON_JS_EXNTS:Array<string>

}

interface ExportHandlerMap {
    extend: {
        jsExtensions:Array<string>
        extensions:Array<string>
        custom: {
            graph: {
                dependencies:Array<VortexAPI.Dependency>
                dependencyMapExposeExports:Array<GraphReturnExportsMapObject>
            }
            compiler : {
                dependencies:Array<VortexAPI.Dependency>
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