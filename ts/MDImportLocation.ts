import ImportLocation from "./ImportLocation.js";
import Module from "./Module.js";

export default class MDImportLocation extends ImportLocation{

    modules:Array<Module>

    constructor(name:string,line:number,modules:Array<Module>){
        super(name,line)
        this.modules = modules
    }

    testForModule(module:Module){
        for(let mod of this.modules){
            if(mod.name == module.name){
                return true
            }
        }
        return false
    }
}