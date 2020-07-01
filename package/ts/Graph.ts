import Module from "./Module.js";
import Dependency from './Dependency'
import ModuleDependency from "./dependencies/ModuleDependency.js";

/**
 * The Dependency Graph used by Vortex
 */

export class VortexGraph {
    /**
     * The starting file
     */
        entryPoint:string
        shuttleEntry:string
    /**
     * List of ALL Dependencys for app/library
     */
        Star:Array<Dependency> = []

    /**
     * @param {string} entrypoint Entry point 
     */

    constructor(entrypoint:string){
        this.entryPoint = entrypoint
    }

    /**
     * Adds entry to Graph
     * @param {Dependency} Dependency Dependency to add to Graph 
     */

    add(Dependency:Dependency){
        this.Star.push(Dependency);
    }

    /**
     * Checks to see if dependency has already been added to Graph. __Type sensitive!!__ 
     * @param {Dependency} Dependency Dependency to check for 
     * @returns {boolean} True or False
     */

    searchFor(Dependency:Dependency) : boolean {
        for (let dep of this.Star){
            if(Dependency.name == dep.name && Object.getPrototypeOf(dep) === Object.getPrototypeOf(Dependency)){
                return true
            }
        }
        return false
    }

    /**
     * Updates old dependency with same name with new dependency
     * @param {Dependency} newDependency The __New__ Dependency to replace the old dependency sharing the same name.
     */
    update(newDependency:Dependency){
        for (let dep of this.Star){
            if(dep.name == newDependency.name) {
                for(let newImpLoc of newDependency.importLocations){
                    if(dep.testForImportLocation(newImpLoc.name) == false){
                        dep.importLocations.push(newImpLoc)
                    }
                }
            }
        }
    }

    remove(Dependency:Dependency){
        let index = this.Star.indexOf(Dependency)
        this.Star.splice(index)
    }

}