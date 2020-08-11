"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueVortexAddon = void 0;
const package_1 = require("../../package");
const promises_1 = require("fs/promises");
const VueUtils = require("@vue/component-compiler-utils");
const uuid_1 = require("uuid");
const VueTemplateCompiler = require('vue-template-compiler');
const sass = require("node-sass");
const less = require("less");
// import {nodes} from 'stylus'
const Pug = require("pug");
const util_1 = require("util");
var renderAsync = util_1.promisify(sass.render);
// import * as Bluebird from 'bluebird'
// const compileStylus = Bluebird.Promise.promisify(stylus.render)
class VVueAddon extends package_1.VortexRTDEAPI.Addons.VortexAddon {
    constructor(name, handler) {
        super(name, handler);
    }
}
class VueComponentDependency extends package_1.VortexRTDEAPI.Dependency {
    constructor(name, initImportLocation) {
        super(name, initImportLocation);
        //Finds component name from Import location! (Assuming all locations import it the same way!!!)
        this.componentName = initImportLocation.modules[0].name;
    }
}
const SearchAndGraphInVueDep = async (Dependency, Graph, planetName) => {
    let buffer = await promises_1.readFile(Dependency.name);
    let file = buffer.toString();
    var { script, styles, template } = VueUtils.parse({ compiler: VueTemplateCompiler, source: file, filename: Dependency.name });
    let code = await CompileComponent({ script, styles, template }, Dependency.name);
    const entry = new package_1.VortexRTDEAPI.QueueEntry(Dependency.name, package_1.VortexRTDEAPI.ParseCode(code, { sourceType: "module" }));
    package_1.VortexRTDEAPI.addQueueEntry(entry);
    package_1.VortexRTDEAPI.NativeDependencyGrapher(package_1.VortexRTDEAPI.loadQueueEntry(entry.name), Graph, planetName);
    return;
};
/**Compiles Parsed Vue Component into Js Code String
 *
 * @param {RawVueComponent} component
 * @param {string} DependencyName
 */
async function CompileComponent(component, DependencyName, ControlPanel) {
    var cssPlanet = ControlPanel.cssPlanet;
    var scopeID = `data-v-${uuid_1.v4()}`;
    var template;
    if (component.template.lang !== undefined) {
        switch (component.template.lang) {
            case 'pug' || 'jade':
                template = Pug.render(component.template.content);
                break;
        }
    }
    else {
        template = component.template.content;
    }
    const renderFuncBody = VueUtils.compileTemplate({ source: template, compiler: VueTemplateCompiler, filename: DependencyName, transformAssetUrls: true });
    const ASTRenderFuncBody = package_1.VortexRTDEAPI.ParseCode(renderFuncBody.code, { allowReturnOutsideFunction: true });
    let styled = component.styles[0] !== undefined;
    if (styled) {
        var scoped = component.styles[0].scoped === undefined ? false : component.styles[0].scoped;
        var cssResult = component.styles[0].content;
        if (component.styles[0].lang !== undefined) {
            switch (component.styles[0].lang) {
                case 'scss' || 'sass':
                    cssResult = (await renderAsync({ file: component.styles[0].content })).css.toString();
                    break;
                case 'less':
                    cssResult = (await less.render(component.styles[0].content)).css;
                    break;
                // case 'stylus':
                //     cssResult = (await compileStylus(component.styles[0].content)).css
                //     break;
            }
        }
        if (scoped) {
            cssResult = VueUtils.compileStyle({ source: cssResult === undefined ? cssResult : cssResult, preprocessLang: component.styles[0].lang, scoped, id: scopeID, filename: DependencyName }).code;
        }
    }
    const MainAST = package_1.VortexRTDEAPI.ParseCode((await package_1.VortexRTDEAPI.BabelCompile(component.script.content)).code, { sourceType: "module" });
    let index = findDefaultExportExpression();
    let props = MainAST.program.body[index].declaration.properties;
    for (let prop of props) {
        if (prop.type === 'ObjectProperty' && prop.key === package_1.VortexRTDEAPI.ESTreeTypes.identifier('render')) {
            prop.value = package_1.VortexRTDEAPI.ESTreeTypes.identifier('render');
            return;
        }
    }
    props.push(package_1.VortexRTDEAPI.ESTreeTypes.objectProperty(package_1.VortexRTDEAPI.ESTreeTypes.identifier('render'), package_1.VortexRTDEAPI.ESTreeTypes.identifier('render')));
    if (styled) {
        if (scoped) {
            props.push(package_1.VortexRTDEAPI.ESTreeTypes.objectProperty(package_1.VortexRTDEAPI.ESTreeTypes.identifier('_scopeId'), package_1.VortexRTDEAPI.ESTreeTypes.stringLiteral(scopeID)));
        }
    }
    MainAST.program.body.reverse();
    MainAST.program.body.push(ASTRenderFuncBody.program.body[0]);
    MainAST.program.body.reverse();
    if (styled && !cssPlanet) {
        MainAST.program.body.push(package_1.VortexRTDEAPI.InjectCSS({ DEPNAME: package_1.VortexRTDEAPI.ESTreeTypes.stringLiteral(DependencyName), CSS: package_1.VortexRTDEAPI.ESTreeTypes.stringLiteral(cssResult) }));
    }
    else if (styled && cssPlanet) {
        package_1.VortexRTDEAPI.pipeCSSContentToBuffer(cssResult);
    }
    return package_1.VortexRTDEAPI.GenerateCode(MainAST).code;
    function findDefaultExportExpression() {
        for (let node of MainAST.program.body) {
            if (node.type === 'ExportDefaultDeclaration') {
                return MainAST.program.body.indexOf(node);
            }
        }
    }
}
const TransformVueComponentImports = (AST, Dependency, CurrentImportLocation) => {
    //Lie to Native Transformer to allow transformations!!
    let newDep = new package_1.VortexRTDEAPI.EsModuleDependency(Dependency.name, Dependency.importLocations[0]);
    newDep.importLocations = Dependency.importLocations;
    return package_1.VortexRTDEAPI.TransformNativeImports(AST, CurrentImportLocation, newDep);
};
const TransformVueComponentExports = (AST, Dependency) => {
    package_1.VortexRTDEAPI.TraverseCode(AST, {
        ExportDefaultDeclaration: function (path) {
            path.replaceWith(package_1.VortexRTDEAPI.ESTreeTypes.assignmentExpression('=', package_1.VortexRTDEAPI.ESTreeTypes.memberExpression(package_1.VortexRTDEAPI.ESTreeTypes.identifier('shuttle_exports'), package_1.VortexRTDEAPI.ESTreeTypes.identifier('MAPPED_DEFAULT')), path.node.declaration));
        }
    });
};
var EXPORTS = new package_1.VortexRTDEAPI.Addons.ExportsHandler();
var MODULE_OBJECT = {};
var VUE_DEPENDENCY = { extension: '.vue', dependency: VueComponentDependency, bundlable: true };
var VUE_GRAPHER = { name: '.vue', grapher: SearchAndGraphInVueDep };
var VUE_TRANSFORMERS = { extname: '.vue', importsTransformer: TransformVueComponentImports, exportsTransformer: TransformVueComponentExports };
MODULE_OBJECT.JS_EXNTS = ['.vue'];
MODULE_OBJECT.CUSTOM_DEPENDENCIES = [VUE_DEPENDENCY];
MODULE_OBJECT.GRAPH_EXTSN = [VUE_GRAPHER];
MODULE_OBJECT.COMPILER_EXTSN = [VUE_TRANSFORMERS];
EXPORTS.register(MODULE_OBJECT);
var SELF = new VVueAddon('VueVortexAddon', EXPORTS);
exports.VueVortexAddon = SELF;
