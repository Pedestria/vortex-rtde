import Module from "./Module.js"
import ImportLocation from "./ImportLocation.js"
import MDImportLocation from "./MDImportLocation.js"

export default class Dependency {
    name:string
    importLocations:Array<ImportLocation>

    constructor(name:string,initImportLocation?:ImportLocation){
        this.name = name
        this.importLocations = []
        this.importLocations.push(initImportLocation)
    }

    testForImportLocation(impLocName:string): boolean{
        for (let impLoc of this.importLocations){
            if(impLoc.name == impLocName){
                return true
            }
        }
        return false
    }

    indexOfImportLocation(impLocName:string) {
        for(let impLoc of this.importLocations){
            if(impLoc.name == impLocName){
                return this.importLocations.indexOf(impLoc)
            }
        }
    }

    updateName(newName:string){
        this.name = newName
    }

    isLibraryDependency() : boolean{
        if(this.name.includes('./')){
            return false
        }
        else{
            return true
        }
    }
}