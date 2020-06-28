import { CSSDependency } from "./dependencies/CSSDependency"
import ImportLocation from "./ImportLocation"
import * as fs from 'fs-extra'
import { LocalizedResolve } from "./Resolve"
import { FileImportLocation } from "./FIleImportLocation"

export function getFileExtension(filename:string){
    let i = filename.lastIndexOf('.')
    return filename.slice(i)
}


export function resolveDependencyType(name:string,initImportLoc:FileImportLocation,currentFile:string){

    let resolvedDependency

    switch(getFileExtension(name)){
        case '.css':       
            resolvedDependency = new CSSDependency(LocalizedResolve(currentFile,name),initImportLoc,fs.readFileSync(LocalizedResolve(currentFile,name)).toString())       
            break;  
    }
    return resolvedDependency
}