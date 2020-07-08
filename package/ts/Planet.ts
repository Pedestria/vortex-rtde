import Dependency from "./Dependency"
import traverse from '@babel/traverse'

import {loadEntryFromQueue} from './GraphGenerator'
import EsModuleDependency from "./dependencies/EsModuleDependency"
import CjsModuleDependency from "./dependencies/CjsModuleDependency"

/**
 * A module container that is loaded asynchronously (via dynamic import or AMD Define)
 */

export class Planet {
    name:string
    entryModule:string
    originalName:string
    entryDependency:Dependency
    importedAt:Array<PlanetImportLocation> = []
    modules:Array<Dependency> = []

    constructor(name:string,entryModule:string){
        this.name=name;
        this.entryModule=entryModule;
    }
}

/**Figure which type of Exports are being made in entry module so it can be transformed properly.
 * 
 * @param {Planet} planet 
 */

export function assignDependencyType(planet:Planet) : Planet{

    enum DepTypes {
        CJS = 1,
        ESM = 2,
        AMD = 3
    }

    let entrydepType

    traverse(loadEntryFromQueue(planet.entryModule).ast,{
        enter(path){
            if(path.isExportDefaultDeclaration){
                entrydepType = DepTypes.ESM
            } else if(path.isExportDeclaration){
                entrydepType = DepTypes.ESM
            }
        },
        MemberExpression: function(path){
            if(path.parent.type !== 'MemberExpression'){
                if(path.node.object.type === 'Identifier'){
                    if(path.node.object.name === 'exports'){
                        entrydepType = DepTypes.CJS
                    } else if(path.node.object.name === 'module' && path.node.property.name === 'exports'){
                        entrydepType = DepTypes.CJS
                    }
                }
            }
        },
    })

    let dep

    if(entrydepType = DepTypes.ESM){
        dep = new EsModuleDependency(null)
        if(planet.originalName.includes('./') == false){
            dep.libLoc = planet.entryModule
        }
        planet.entryDependency = dep
        return planet
    } else if(entrydepType = DepTypes.CJS){
        dep = new CjsModuleDependency(null)
        if(planet.originalName.includes('./') == false){
            dep.libLoc = planet.entryModule
        }
        planet.entryDependency = dep
        return planet
    }


}

export class PlanetClusterMapObject{

    importedAt:Array<string> = []
    planetsByOriginalName:Array<string>
    planetsByNewName:Array<string>

}

export class PlanetImportLocation {

    name:string
    clusterImport:boolean

    constructor(name:string,clusterImport:boolean){
        this.name = name
        this.clusterImport = clusterImport
    }
}