import {VortexRTDEAPI}from "../../package"
import {renderSync} from 'node-sass';

class VMoreStylesAddon extends VortexRTDEAPI.Addons.VortexAddon{
    constructor(name:string,handler:VortexRTDEAPI.Addons.ExportsHandler){
        super(name,handler);
    }
}


class SassDependency extends VortexRTDEAPI.CSSDependency {

    constructor(name:string,initImportLocation:VortexRTDEAPI.FileImportLocation,stylesheet:string){
        let compiledSheet = renderSync({file:stylesheet}).css.toString();
        super(name,initImportLocation,compiledSheet);
    }
}

var MODULE_OBJECT:VortexAddonModule = {};

var SASS_DEPENDENCY:CustomGraphDependencyMapObject = {extension:'.scss',dependency:SassDependency,bundlable:false}

MODULE_OBJECT.NON_JS_EXNTS = ['.scss']
MODULE_OBJECT.CUSTOM_DEPENDENCIES = [SASS_DEPENDENCY]

var EXPORT = new VortexRTDEAPI.Addons.ExportsHandler()
EXPORT.register(MODULE_OBJECT);
var SELF = new VMoreStylesAddon('VMoreStylesAddon',EXPORT)
export {SELF as VortexMoreStylesAddon}
