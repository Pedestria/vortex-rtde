import Dependency from './types/Dependency'
import ImportLocation from './types/ImportLocation'
import ModuleDependency from './types/dependencies/ModuleDependency'
import MDImportLocation from './types/importlocations/MDImportLocation'
import { QueueEntry, addEntryToQueue, loadEntryFromQueue, GraphDepsAndModsForCurrentFile } from './types/GraphGenerator'
import traverse from '@babel/traverse'
import { VortexGraph } from './types/Graph'
import { transformAsync} from '@babel/core'
import { BabelSettings, ParseSettings } from './types/Options'
import generate from '@babel/generator'
import {parse} from '@babel/parser'
import {TransformImportsFromAST, TransformExportsFromAST, CSSInjector, pipeCSSContentToBuffer} from './types/Compiler'
import EsModuleDependency from './types/dependencies/EsModuleDependency'
import {CSSDependency} from './types/dependencies/CSSDependency'
import {FileImportLocation} from './types/importlocations/FileImportLocation'
import * as t from '@babel/types'
import * as _ from 'lodash'

interface InternalVortexAddons{
    extensions:{
        js:Array<string>
        other:Array<string>
    }
    importedDependencies:Array<CustomGraphDependencyMapObject>
    importedGraphers:Array<CustomDependencyGrapher>
    importedCompilers:Array<CompilerCustomDependencyMap>
}

type DependencyConstructor<T extends typeof Dependency> = InstanceType<T>

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

declare function BabelCompile(code: string) {
    return transformAsync(code, BabelSettings)
}

declare class VortexAddon {

    name:string
    handler:ExportsHandler
    /**
     * 
     * @param {string} name Addon Name
     */
    constructor(name:string, handler:ExportsHandler)
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

type CustomPreCompiler = (filename:string) => Promise<string>;

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

interface PreCompiledCSSDependency {
    precomp:true
    compile():Promise<void>
}

declare class ExportsHandler {
    exports:ExportHandlerMap
    /**
     * Register Addon Functionality
     * @param moduleObject 
     */
    register(moduleObject:VortexAddonModule):void
}

declare namespace Addons {

    export{
        VortexAddon,
        ExportsHandler,
        Grapher,
        VortexAddonModule,
        ImportsTransformer,
        ExportsTransformer,
        CustomDependencyGrapher,
        CustomGraphDependencyMapObject,
        CompilerCustomDependencyMap,
        PreCompiledCSSDependency,
        CustomBranchObject,
        CustomPreCompiler
    }
}

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
        t as ESTreeTypes,
        ControlPanel
    }
}

export = VortexAPI;