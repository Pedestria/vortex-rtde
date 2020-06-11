import Dependency from "../Dependency.js";
import Module from "../Module.js";

export default class ModuleDependency extends Dependency {

    acquiredModules:Array<Module>

    constructor(name:string,acquiredModules:Array<Module>,initSuperDependency?:string){
        super(name,initSuperDependency)
        this.acquiredModules = acquiredModules
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