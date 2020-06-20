import Dependency from "../Dependency.js";
import Module from "../Module.js";
import MDImportLocation from "../MDImportLocation.js";

/**
 * A JavaScript Dependency where modules are acquired from.
 *
 * @extends Dependency
 * 
 */
export default class ModuleDependency extends Dependency {

    acquiredModules:Array<Module>
    libLoc:string|Array<string>

    constructor(name:string,initImportLocation?:MDImportLocation){
        super(name,initImportLocation)
        //this.acquiredModules = acquiredModules
    }

    // testForModule(module:Module): boolean{
    //     for (let mod of this.acquiredModules){
    //         if(module.name == mod.name){
    //             return true
    //         }
    //     }
    //     return false
    // }

}