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
    ControlPanel
    
}
export * as BabelTypes from '@babel/types'
