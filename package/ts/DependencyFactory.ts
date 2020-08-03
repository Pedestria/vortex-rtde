import { CSSDependency } from "./dependencies/CSSDependency"
import ImportLocation from "./ImportLocation"
import * as fs from 'fs-extra'
import { LocalizedResolve } from "./Resolve"
import { FileImportLocation } from "./importlocations/FileImportLocation"
import { FileDependency } from "./dependencies/FileDependency"
import Dependency from "./Dependency"
import { VortexError, VortexErrorType } from "./VortexError"
import _ = require("lodash")
import * as path from 'path'

/**Resolves a Non-JS dependency type.
 * 
 * @param {string} name Name of Dependency
 * @param {FileImportLocation} initImportLoc Intial Import Location
 * @param {string} currentFile Current File Being Graphed
 */


export function resolveDependencyType(name:string,initImportLoc:FileImportLocation,currentFile:string){

    let resolvedDependency:Dependency

    switch(path.extname(name)){
        case '.css':       
            resolvedDependency = new CSSDependency(LocalizedResolve(currentFile,name),initImportLoc,fs.readFileSync(LocalizedResolve(currentFile,name)).toString())       
            break;  
        case '.png':
            resolvedDependency = new FileDependency(LocalizedResolve(currentFile,name),initImportLoc)
            break;
        case '.otf':
            resolvedDependency = new FileDependency(LocalizedResolve(currentFile,name),initImportLoc)
            break;
        case '.ttf':
            resolvedDependency = new FileDependency(LocalizedResolve(currentFile,name),initImportLoc)
            break;
    }
    return resolvedDependency
}

/**Checks `depName` to see if the Dependency is NOT Native to Vortex's Internal Dependencies.
 * 
 * @param {string} depName 
 */

export function notNativeDependency(depName:string,ControlPanel): boolean{

    if(!ControlPanel.InstalledAddons){
        return false
    }

    let ALL_ADDON_EXNTS:Array<string> = _.concat(ControlPanel.InstalledAddons.extensions.js,ControlPanel.InstalledAddons.extensions.other)

    for(let ext of ALL_ADDON_EXNTS){
        if(path.extname(depName) === ext){
            return true
        }
    }
    return false
}

export function resolveNonNativeDependency(depName:string,initImportLoc:ImportLocation,ControlPanel){

    let resolvedDependency:Dependency

    for(let depMapObject of ControlPanel.InstalledAddons.importedDependencies){
        if(depMapObject.extension === path.extname(depName)){
            resolvedDependency = new depMapObject.dependency<Dependency>(depName,initImportLoc);
        }
    }

    return resolvedDependency

}

export function resolveGrapherForNonNativeDependency(Dependency:Dependency,ControlPanel){

    for(let GrapherMap of ControlPanel.InstalledAddons.importedGraphers){
        if(GrapherMap.name === path.extname(Dependency.name)){
            return GrapherMap.grapher
        }
    }

}

export function resolveTransformersForNonNativeDependency(Dependency:Dependency,ControlPanel){

    for(let CompilerMap of ControlPanel.InstalledAddons.importedCompilers){
        if(CompilerMap.extname === path.extname(Dependency.name)){
            let {importsTransformer,exportsTransformer} = CompilerMap
            return {importsTransformer,exportsTransformer}
        }
    }
}

export function CustomDependencyIsBundlable(Dependency:Dependency,ControlPanel){

    for(let depMapObject of ControlPanel.InstalledAddons.importedDependencies){
        if(depMapObject.extension === path.extname(Dependency.name)){
            return depMapObject.bundlable
        }
    }

}
