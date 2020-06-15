import Dependency from "../Dependency.js";
import Module from "../Module.js";

export default class ModuleDependency extends Dependency {

    acquiredModules:Array<Module>
    libLoc:string

    constructor(name:string,acquiredModules:Array<Module>,initImportLocation?:string,libLoc?:string){
        super(name,initImportLocation)
        this.acquiredModules = acquiredModules
        this.libLoc = libLoc
    }

    testForModule(module:Module): boolean{
        for (let mod of this.acquiredModules){
            if(module.name == mod.name){
                return true
            }
        }
        return false
    }

}