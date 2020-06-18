import Module from "./Module.js";
import Dependency from './Dependency'
import ModuleDependency from "./dependencies/ModuleDependency.js";

export class VortexGraph {

        entryPoint:string
        Star:Array<Dependency> = []

    constructor(entrypoint:string){
        this.entryPoint = entrypoint
    }

    add(Dependency:Dependency){
        this.Star.push(Dependency);
    }

    searchFor(Dependency:Dependency) : boolean {
        for (let dep of this.Star){
            if(Dependency.name == dep.name) {
                return true
            }
        }
        return false
    }
    update(newDependency:Dependency){
        for (let dep of this.Star){
            if(newDependency instanceof ModuleDependency && dep instanceof ModuleDependency){
                ModuleDependencyUpdater(newDependency,dep)
            }
        }
    }

    remove(Dependency:Dependency){
        let index = this.Star.indexOf(Dependency)
        this.Star.splice(index)
    }

    display(): Array<Dependency> {
        return this.Star
    }
}

function ModuleDependencyUpdater(newDependency:ModuleDependency,dep:ModuleDependency){
    if(dep.name == newDependency.name) {
        // for(let newMod of newDependency.acquiredModules){
        //     if(dep.testForModule(newMod) == false){
        //         dep.acquiredModules.push(newMod)
        //     }
        // }
        for(let newImpLoc of newDependency.importLocations){
            if(dep.testForImportLocation(newImpLoc.name) == false){
                dep.importLocations.push(newImpLoc)
            }
        }
    }
}