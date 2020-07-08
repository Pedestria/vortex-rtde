import * as VortexAPI from './API'
import * as t from '@babel/types'
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

   exports:{
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