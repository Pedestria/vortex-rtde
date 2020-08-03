import ImportLocation from "../ImportLocation.js";
import Module, {ModuleTypes} from "../Module.js";

export default class MDImportLocation extends ImportLocation{

    modules:Array<Module<keyof typeof ModuleTypes>>
    relativePathToDep:string

    constructor(name:string,line:number,modules:Array<Module<keyof typeof ModuleTypes>>,relativePath:string){
        super(name,line)
        this.modules = modules
        this.relativePathToDep = relativePath
    }

    testForModule(module:Module<keyof typeof ModuleTypes>){
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