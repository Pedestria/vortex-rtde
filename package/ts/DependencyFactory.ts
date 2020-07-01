import { CSSDependency } from "./dependencies/CSSDependency"
import ImportLocation from "./ImportLocation"
import * as fs from 'fs-extra'
import { LocalizedResolve } from "./Resolve"
import { FileImportLocation } from "./FIleImportLocation"
import { FileDependency } from "./dependencies/FileDependency"
import Dependency from "./Dependency"
import {extensions} from "./Main"
import * as chalk from 'chalk'
import { VortexError, VortexErrorType } from "./VortexError"

export function getFileExtension(filename:string){
    let i = filename.lastIndexOf('.')
    return filename.slice(i)
}

/**Resolves a Non-JS dependency type.
 * 
 * @param {string} name Name of Dependency
 * @param {FileImportLocation} initImportLoc Intial Import Location
 * @param {string} currentFile Current File Being Graphed
 */


export function resolveDependencyType(name:string,initImportLoc:FileImportLocation,currentFile:string){

    if(!extensions.includes(getFileExtension(name))){
        throw new VortexError(`Cannot resolve extension ${getFileExtension(name)}.`,VortexErrorType.PortalPanelError)
    }

    let resolvedDependency:Dependency

    switch(getFileExtension(name)){
        case '.css':       
            resolvedDependency = new CSSDependency(LocalizedResolve(currentFile,name),initImportLoc,fs.readFileSync(LocalizedResolve(currentFile,name)).toString())       
            break;  
        case '.png'||'.jpeg':
            resolvedDependency = new FileDependency(LocalizedResolve(currentFile,name),initImportLoc)
            break;
    }
    return resolvedDependency
}