import { VortexAddon, ExportsHandler, VortexAddonModule } from "../Addon";

export class VVueAddon extends VortexAddon {
    constructor(name:string,handler:ExportsHandler){
        super(name,handler);
    }
}

var EXPORTS = new ExportsHandler()
var MODULE_OBJECT:VortexAddonModule = {};

MODULE_OBJECT.JS_EXNTS = ['.vue']





















EXPORTS.register(MODULE_OBJECT)
var SELF = new VVueAddon('VueVortexAddon',EXPORTS)
export {SELF as VueVortexAddon}