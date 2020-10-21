import Dependency from './Dependency'
import { Planet, PlanetClusterMapObject } from "./Planet.js";

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
     * List of ALL Dependencys that are imported synchronously for app/library
     */
        Star:Array<Dependency> = []
        /**
         * List of ALL Planets for app/library
         */
        Planets:Array<Planet> = []
        PlanetClusterMap:Array<PlanetClusterMapObject> = []

    /**
     * @param {string} entrypoint Entry point 
     */

    constructor(entrypoint?:string){
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
                break;
            }
        }
    }

    remove(Dependency:Dependency){
        let index = this.Star.indexOf(Dependency)
        this.Star.splice(index)
    }

    /**Adds dependency to specified planet.
     * 
     * @param {Dependency} Dependency 
     * @param {string} planetName Planet to add dependency to.
     */

    addToPlanet(Dependency:Dependency,planetName:string){
        for(let planet of this.Planets){
            if(planet.name === planetName){
                planet.modules.push(Dependency)
                break;
            }
        }
    }

    /**Searchs for dependency on given planet.
     * 
     * @param {Dependency} Dependency 
     * @param {string} planetName Planet to search for dependency on
     * @returns {boolean} True or False 
     */

    searchForOnPlanet(Dependency:Dependency,planetName:string): boolean{
        for(let planet of this.Planets){
            if(planet.name === planetName){
                for(let dep of planet.modules){
                    if(dep.name === Dependency.name){
                        return true
                    }
                }
                return false
            }
        }
    }

    /**Updates dependency with new given dependency that share the same name
     * 
     * @param newDependency The __New__ Dependency.
     * @param planetName The Planet of where old dependency is located.
     */

    updateOnPlanet(newDependency:Dependency,planetName:string){
        for(let planet of this.Planets){
            if(planet.name === planetName){
                for(let dep of planet.modules){
                    if(dep.name === newDependency.name){
                        for(let newImpLoc of newDependency.importLocations){
                            if(dep.testForImportLocation(newImpLoc.name) == false){
                                dep.importLocations.push(newImpLoc)
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    /**Tests to see if planet has been created via the entry module.
     * 
     * @param {string} entryModule Entry module
     * @returns {boolean} True or False
     */

    planetExists(entryModule:string){
        for(let planet of this.Planets){
            if(planet.entryModule === entryModule){
                return true
            }
        }
        return false
    }

    /**Finds index of planet via entry module.
     * 
     * @param {string} entryModule Entry Module 
     * @returns {number} Index
     */

    indexOfPlanet(entryModule:string){
        for(let planet of this.Planets){
            if(planet.entryModule === entryModule){
                return this.Planets.indexOf(planet)
            }
        }
        return null
    }

}