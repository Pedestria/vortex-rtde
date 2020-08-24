import traverse from '@babel/traverse'
import { transformAsync, TransformOptions, ParserOptions} from '@babel/core'
import generate from '@babel/generator'
import {parse} from '@babel/parser'
import * as t from '@babel/types'
import * as _ from 'lodash'
import * as css from 'css'

declare var BabelSettings: TransformOptions;
declare var ParseSettings: ParserOptions;

declare class ImportLocation {
    name: string;
    line: number;
    constructor(name: string, line: number);
}

declare class FileImportLocation extends ImportLocation {
    relativePathToDep: string;
    localName?: string;
    constructor(name: string, line: number, relativePathToDep: string, localName?: string);
}

/**
 * An Exported Function, Class, or Variable from a specific file or library.
 */
declare class Module<T extends keyof typeof ModuleTypes> {
    /**
     * Name of Module
     */
    name: string;
    /**
     * Type of Module
     */
    type: ModuleTypes;
    /**
     *
     * @param {string} name Name of Module
     * @param {ModuleTypes} type Type of Module
     */
    constructor(name: string, type: T);
}
/**
 * The Standardized System For Vortex Module Types
 */
declare enum ModuleTypes {
    /**
     * Named ECMAScript Module
     */
    EsModule = 0,
    /**
     * Default ECMAScript Module
     */
    EsDefaultModule = 1,
    /**
     * ECMAScript Namespace __(Import * as -- from -- )__
     */
    EsNamespaceProvider = 2,
    /**
     * Named CommonJS Module
     */
    CjsModule = 3,
    /**
     * Defualt CommonJs Module
     */
    CjsDefaultModule = 4,
    /**
     * Default CommonJS Module Executed on Call.
     * __(module.exports = () => {--MODULE CODE HERE--})__
     */
    CjsDefaultFunction = 5,
    /**
     * CommonJS Namespace __(const -- = require(--))__
     */
    CjsNamespaceProvider = 6,
    CjsInteropRequire = 7,
    EsDefaultNamespaceProvider = 8,
    CJSAsset = 9,
    CJSLoad = 10
}

declare class MDImportLocation extends ImportLocation {
    modules: Array<Module<keyof typeof ModuleTypes>>;
    relativePathToDep: string;
    constructor(name: string, line: number, modules: Array<Module<keyof typeof ModuleTypes>>, relativePath: string);
    testForModule(module: Module<keyof typeof ModuleTypes>): boolean;
    indexOfModuleByName(name: string): number;
}
/** 
* A Dependent File or Library that is required by another file.
*/
declare class Dependency {
    /**
     * Location/Name of Dependency
     */
    name: string;
    /**
     * ALL Import Locations of this Dependency
     */
    importLocations: Array<ImportLocation>;
    /**
     *
     * @param {string} name Name of Dependency
     * @param {ImportLocation} initImportLocation Inital location where the Dependency is imported from
     */
    constructor(name: string, initImportLocation?: ImportLocation);
    testForImportLocation(impLocName: string): boolean;
    indexOfImportLocation(impLocName: string): number;
    updateName(newName: string): void;
    isLibraryDependency(): boolean;
}

/**
 * A Stylesheet Dependency
 * @extends Dependency
 */
declare class CSSDependency extends Dependency {
    /**
     * CSS file in string Format
     */
    stylesheet: string;
    dependencies: Array<Dependency>;
    constructor(name: string, initImportLocation: FileImportLocation, stylesheet: string);
}

/**
 * A JavaScript Dependency where modules are acquired from.
 * @abstract
 * @extends Dependency
 *
 */
declare abstract class ModuleDependency extends Dependency {
    libLoc: string;
    outBundle: boolean;
    constructor(name: string, initImportLocation?: MDImportLocation);
}

/**ECMAScript Dependency that contain exported Modules.
 * @extends ModuleDependency
 */
declare class EsModuleDependency extends ModuleDependency {
    constructor(name: string, initImportLocation?: MDImportLocation);
    verifyImportedModules(entry: QueueEntry, currentImpLoc: MDImportLocation): void;
}

/**
 * A module container that is loaded asynchronously (via dynamic import or AMD Define)
 */
declare class Planet {
    name: string;
    entryModule: string;
    entryModuleIsLibrary: boolean;
    originalName: string;
    entryDependency: Dependency;
    importedAt: Array<PlanetImportLocation>;
    modules: Array<Dependency>;
    constructor(name: string, entryModule: string);
}
/**Figure which type of Exports are being made in entry module so it can be transformed properly.
 *
 * @param {Planet} planet
 */
declare function assignDependencyType(planet: Planet, queue: any): Planet;
declare class PlanetClusterMapObject {
    importedAt: Array<string>;
    planetsByOriginalName: Array<string>;
    planetsByNewName: Array<string>;
}
declare class PlanetImportLocation {
    name: string;
    clusterImport: boolean;
    constructor(name: string, clusterImport: boolean);
}




declare class VortexGraph {
    /**
     * The starting file
     */
    entryPoint: string;
    shuttleEntry: string;
    /**
     * List of ALL Dependencys that are imported synchronously for app/library
     */
    Star: Array<Dependency>;
    /**
     * List of ALL Planets for app/library
     */
    Planets: Array<Planet>;
    PlanetClusterMap: Array<PlanetClusterMapObject>;
    /**
     * @param {string} entrypoint Entry point
     */
    constructor(entrypoint?: string);
    /**
     * Adds entry to Graph
     * @param {Dependency} Dependency Dependency to add to Graph
     */
    add(Dependency: Dependency): void;
    /**
     * Checks to see if dependency has already been added to Graph. __Type sensitive!!__
     * @param {Dependency} Dependency Dependency to check for
     * @returns {boolean} True or False
     */
    searchFor(Dependency: Dependency): boolean;
    /**
     * Updates old dependency with same name with new dependency
     * @param {Dependency} newDependency The __New__ Dependency to replace the old dependency sharing the same name.
     */
    update(newDependency: Dependency): void;
    remove(Dependency: Dependency): void;
    /**Adds dependency to specified planet.
     *
     * @param {Dependency} Dependency
     * @param {string} planetName Planet to add dependency to.
     */
    addToPlanet(Dependency: Dependency, planetName: string): void;
    /**Searchs for dependency on given planet.
     *
     * @param {Dependency} Dependency
     * @param {string} planetName Planet to search for dependency on
     * @returns {boolean} True or False
     */
    searchForOnPlanet(Dependency: Dependency, planetName: string): boolean;
    /**Updates dependency with new given dependency that share the same name
     *
     * @param newDependency The __New__ Dependency.
     * @param planetName The Planet of where old dependency is located.
     */
    updateOnPlanet(newDependency: Dependency, planetName: string): void;
    /**Tests to see if planet has been created via the entry module.
     *
     * @param {string} entryModule Entry module
     * @returns {boolean} True or False
     */
    planetExists(entryModule: string): boolean;
    /**Finds index of planet via entry module.
     *
     * @param {string} entryModule Entry Module
     * @returns {number} Index
     */
    indexOfPlanet(entryModule: string): number;
}

declare var queue: Array<QueueEntry>;
declare function isInQueue(entryName: string): boolean;
declare function addEntryToQueue(entry: QueueEntry): void;
declare function loadEntryFromQueue(entryName: string): QueueEntry;
declare class QueueEntry {
    name: string;
    ast: t.File | css.Stylesheet;
    external?: boolean;
    constructor(name: string, parsedCode: t.File | css.Stylesheet);
}
/**
 * Generates a Vortex Graph of your app/library.
 * @param {string} entry Entry point for GraphGenerator
 * @returns {VortexGraph} A Dependency Graph
 *
 */
declare function GenerateGraph(entry: string, modEntry: string, ControlPanel: ControlPanel): Promise<VortexGraph>;
declare function GraphDepsAndModsForCurrentFile(entry: QueueEntry, Graph: VortexGraph, planetName: string, panel: ControlPanel, ASTQueue: any): void;

declare function pipeCSSContentToBuffer(content: string): void;
interface Bundle {
    code: string;
    value: string;
}
/**
 * Creates a Star/Solar System depending on the global config/async imports.
 * @param {VortexGraph} Graph The Dependency Graph created by the Graph Generator
 * @returns {Promise<Bundle[]>} An Array of Bundle Code Objects
 */
declare function Compile(Graph: VortexGraph, ControlPanel: any): Promise<Bundle[]>;
/**
 * Compiles imports from the provided AST into the Shuttle Module Loader format.
 *
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {MDImportLocation} currentImpLoc The Current ModuleDependency Import Location
 * @param {ModuleDependency} dep The current ModuleDependency.
 */
declare function TransformImportsFromAST(ast: t.File, currentImpLoc: MDImportLocation, dep: ModuleDependency): void;
/**Compiles exports from the provided AST into the Shuttle Module Loader format.
 *
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {ModuleDependency} dep The Current ModuleDependency
 */
declare function TransformExportsFromAST(ast: t.File, dep: ModuleDependency): void;
declare const CSSInjector: (arg?: import("@babel/template").PublicReplacements) => t.BlockStatement | t.DoWhileStatement | t.ForInStatement | t.ForStatement | t.FunctionDeclaration | t.SwitchStatement | t.WhileStatement | t.ForOfStatement | t.BreakStatement | t.ClassDeclaration | t.ContinueStatement | t.ReturnStatement | t.ThrowStatement | t.IfStatement | t.DebuggerStatement | t.VariableDeclaration | t.ExportAllDeclaration | t.ExportDefaultDeclaration | t.ExportNamedDeclaration | t.ImportDeclaration | t.DeclareClass | t.DeclareFunction | t.DeclareInterface | t.DeclareModule | t.DeclareModuleExports | t.DeclareTypeAlias | t.DeclareOpaqueType | t.DeclareVariable | t.DeclareExportDeclaration | t.DeclareExportAllDeclaration | t.InterfaceDeclaration | t.OpaqueType | t.TypeAlias | t.EnumDeclaration | t.TSDeclareFunction | t.TSInterfaceDeclaration | t.TSTypeAliasDeclaration | t.TSEnumDeclaration | t.TSModuleDeclaration | t.EmptyStatement | t.ExpressionStatement | t.LabeledStatement | t.TryStatement | t.WithStatement | t.TSImportEqualsDeclaration | t.TSExportAssignment | t.TSNamespaceExportDeclaration | t.Statement[];


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