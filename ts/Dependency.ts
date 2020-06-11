import Module from "./Module.js"

export default class Dependency {
    name:string
    acquiredModules:Array<Module>
    superDependencies?:Array<String>

    constructor(name:string,acquiredModules?:Array<Module>,initSuperDependency?:String){
        this.name = name
        this.acquiredModules = acquiredModules
        this.superDependencies = []
        this.superDependencies.push(initSuperDependency)
    }

    testForModule(module:Module): boolean{
        for (let mod of this.acquiredModules){
            if(module.name == mod.name){
                return true
            }
        }
        return false
    }

    testForSuperDependency(superDep:String): boolean{
        for (let supDp of this.superDependencies){
            if(superDep == supDp){
                return true
            }
        }
        return false
    }
}