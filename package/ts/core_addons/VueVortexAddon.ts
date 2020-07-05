import { VortexAddon, ExportsHandler } from "../Addon";

var HANDLER = new ExportsHandler();

class VueAddon extends VortexAddon {
    constructor(name:string,handler:ExportsHandler){
        super(name,handler);
    }
}

var MAIN_EXT = '.vue'











HANDLER.exports.extend.jsExtensions.push(MAIN_EXT)

export var VueVortexAddon = new VueAddon('Vue',HANDLER)
