import Module from "./Module.js"

export default class Dependency {
    name:string
    superDependencies?:Array<String>

    constructor(name:string,initSuperDependency?:String){
        this.name = name
        this.superDependencies = []
        this.superDependencies.push(initSuperDependency)
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