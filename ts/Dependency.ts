import Module from "./Module.js"

export default class Dependency {
    name:string
    importLocations:Array<String>

    constructor(name:string,initInportLocation?:String){
        this.name = name
        this.importLocations = []
        this.importLocations.push(initInportLocation)
    }

    testForImportLocation(superDep:String): boolean{
        for (let supDp of this.importLocations){
            if(superDep == supDp){
                return true
            }
        }
        return false
    }
}