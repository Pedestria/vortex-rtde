import ImportLocation from "../ImportLocation.js";
import Module from "../Module.js";

export default class MDImportLocation extends ImportLocation{

    modules:Array<Module>
    relativePathToDep:string

    constructor(name:string,line:number,modules:Array<Module>,relativePath:string){
        super(name,line)
        this.modules = modules
        this.relativePathToDep = relativePath
    }

    testForModule(module:Module){
        for(let mod of this.modules){
            if(mod.name == module.name){
                return true
            }
        }
        return false
    }

    indexOfModuleByName(name:string){
        for(let mod of this.modules){
            if(mod.name == name){
                return this.modules.indexOf(mod)
            }
        }
        return null
    }
}