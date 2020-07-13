import Dependency from './Dependency'
import ImportLocation from './ImportLocation'
import ModuleDependency from './dependencies/ModuleDependency'
import MDImportLocation from './importlocations/MDImportLocation'
import { QueueEntry, addEntryToQueue } from './GraphGenerator'
import traverse from '@babel/traverse'
import { VortexGraph } from './Graph'
import { transformAsync} from '@babel/core'
import { BabelSettings, ParseSettings } from './Options'
import { GraphDepsAndModsForCurrentFile } from './GraphGenerator'
import generate from '@babel/generator'
import {parse} from '@babel/parser'
import {TransformImportsFromAST, TransformExportsFromAST, CSSInjector} from './Compiler'
import EsModuleDependency from './dependencies/EsModuleDependency'

function BabelCompile(code: string) {
    return transformAsync(code, BabelSettings)
}


export {
    Dependency,
    ImportLocation,
    ModuleDependency,
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
    EsModuleDependency
    
}
export * as BabelTypes from '@babel/types'
