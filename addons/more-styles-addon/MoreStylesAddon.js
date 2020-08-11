"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VortexMoreStylesAddon = void 0;
const package_1 = require("../../package");
const node_sass_1 = require("node-sass");
const util_1 = require("util");
const promises_1 = require("fs/promises");
const path = require("path");
var renderAsync = util_1.promisify(node_sass_1.render);
class VMoreStylesAddon extends package_1.VortexRTDEAPI.Addons.VortexAddon {
    constructor(name, handler) {
        super(name, handler);
    }
}
class SassDependency extends package_1.VortexRTDEAPI.CSSDependency {
    constructor(name, initImportLocation, stylesheet) {
        super(name, initImportLocation, stylesheet);
        this.precomp = true;
    }
    async compile() {
        this.stylesheet = (await renderAsync({ file: this.name })).css.toString();
    }
}
function ResolveRelative(from, to) {
    return path.join(path.dirname(from), to);
}
const SassPreCompiler = async (filename) => {
    let importCapturerRegex = /^@import +(?:(?=["|'])(["|']([\w.\/]+)["|']))/gm;
    let sass = (await promises_1.readFile(filename)).toString();
    let includeDirs = [];
    while (importCapturerRegex.exec(sass) !== null) {
        let result = path.dirname(ResolveRelative(filename, RegExp.$2));
        if (!includeDirs.includes(result)) {
            includeDirs.push(result);
        }
    }
    return (await renderAsync({ data: sass, includePaths: includeDirs })).css.toString();
};
var MODULE_OBJECT = {};
var SASS_DEPENDENCY = { extension: '.scss', dependency: SassDependency, bundlable: false };
var SASS_LIVE_BRANCH = { ext: '.scss', type: "CSS", precompiler: SassPreCompiler };
MODULE_OBJECT.NON_JS_EXNTS = ['.scss'];
MODULE_OBJECT.CUSTOM_DEPENDENCIES = [SASS_DEPENDENCY];
MODULE_OBJECT.CUSTOM_BRANCHES = [SASS_LIVE_BRANCH];
var EXPORT = new package_1.VortexRTDEAPI.Addons.ExportsHandler();
EXPORT.register(MODULE_OBJECT);
var SELF = new VMoreStylesAddon('VMoreStylesAddon', EXPORT);
exports.VortexMoreStylesAddon = SELF;
