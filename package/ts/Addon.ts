/**
 * Vortex Addon Interface
 */
class VortexAddon {

    name:string
    overrides:Array<VortexContexualOverride>
    /**
     * 
     * @param {string} name Addon Name
     * @param {VortexContexualOverride[]} overrides Overrides Provided by Addon
     */
    constructor(name:string,overrides:Array<VortexContexualOverride>){
        this.name = name;
        this.overrides = overrides;

    }

}

class VortexContexualOverride {
    type:OverrideType

    constructor(type:OverrideType){
        this.type = type
    }


}

enum OverrideType {
    COMPILER = 1,
    GRAPH_GENERATOR = 2,
    DEPENDENCY = 3,
    IMPORT_LOCATION = 4,
    MODULE_TYPES = 5,

}