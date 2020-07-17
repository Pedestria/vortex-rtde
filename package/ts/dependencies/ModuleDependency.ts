import Dependency from "../Dependency.js";
import Module from "../Module.js";
import MDImportLocation from "../importlocations/MDImportLocation.js";

/**
 * A JavaScript Dependency where modules are acquired from.
 * @abstract
 * @extends Dependency
 * 
 */
export default abstract class ModuleDependency extends Dependency {

    acquiredModules:Array<Module>
    libLoc:string
    outBundle:boolean

    constructor(name:string,initImportLocation?:MDImportLocation){
        super(name,initImportLocation)
        this.outBundle = false
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