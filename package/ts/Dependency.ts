import ImportLocation from "./ImportLocation.js"

/**@abstract
 * A Dependent File or Library that is required by another file.
 */
export default class Dependency {
    /**
     * Location/Name of Dependency
     */
    name:string
    /**
     * ALL Import Locations of this Dependency
     */
    importLocations:Array<ImportLocation>
    /**
     * 
     * @param {string} name Name of Dependency
     * @param {ImportLocation} initImportLocation Inital location where the Dependency is imported from 
     */

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