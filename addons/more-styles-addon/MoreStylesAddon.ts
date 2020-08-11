import {VortexRTDEAPI}from "../../package"
import {render} from 'node-sass';
import { promisify } from "util";
import {readFile} from 'fs/promises'
import * as path from 'path'

var renderAsync = promisify(render);

class VMoreStylesAddon extends VortexRTDEAPI.Addons.VortexAddon{
    constructor(name:string,handler:VortexRTDEAPI.Addons.ExportsHandler){
        super(name,handler);
    }
}


class SassDependency extends VortexRTDEAPI.CSSDependency implements VortexRTDEAPI.Addons.PreCompiledCSSDependency {
    precomp:true

    constructor(name:string,initImportLocation:VortexRTDEAPI.FileImportLocation,stylesheet:string){
        super(name,initImportLocation,stylesheet);
        this.precomp = true;
    }
    async compile(): Promise<void> {
        this.stylesheet = (await renderAsync({file:this.name})).css.toString();
    }

    
}

function ResolveRelative(from:string,to:string){
    return path.join(path.dirname(from),to);
}

const SassPreCompiler:VortexRTDEAPI.Addons.CustomPreCompiler = async (filename:string) => {
    let importCapturerRegex:RegExp = /^@import +(?:(?=["|'])(["|']([\w.\/]+)["|']))/gm
    let sass = (await readFile(filename)).toString();
    let includeDirs:Array<string> = []
    while(importCapturerRegex.exec(sass) !== null) {
        let result = path.dirname(ResolveRelative(filename,RegExp.$2));
        if(!includeDirs.includes(result)){
            includeDirs.push(result);
        }
    }

    return (await renderAsync({data:sass,includePaths:includeDirs})).css.toString();
}

var MODULE_OBJECT:VortexRTDEAPI.Addons.VortexAddonModule = {};

var SASS_DEPENDENCY:VortexRTDEAPI.Addons.CustomGraphDependencyMapObject = {extension:'.scss',dependency:SassDependency,bundlable:false}

var SASS_LIVE_BRANCH:VortexRTDEAPI.Addons.CustomBranchObject = {ext:'.scss',type:"CSS",precompiler:SassPreCompiler}

MODULE_OBJECT.NON_JS_EXNTS = ['.scss']
MODULE_OBJECT.CUSTOM_DEPENDENCIES = [SASS_DEPENDENCY]
MODULE_OBJECT.CUSTOM_BRANCHES = [SASS_LIVE_BRANCH]

var EXPORT = new VortexRTDEAPI.Addons.ExportsHandler()
EXPORT.register(MODULE_OBJECT);
var SELF = new VMoreStylesAddon('VMoreStylesAddon',EXPORT)
export {SELF as VortexMoreStylesAddon}
