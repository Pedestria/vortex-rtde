import {VortexRTDEAPI} from "@vortex-rtde/core";
import {readFile} from 'fs/promises'
import * as VueUtils from '@vue/component-compiler-utils'
import { v4 } from "uuid";
const VueTemplateCompiler = require('vue-template-compiler')
import * as sass from 'node-sass'
import * as less from 'less'
// import {nodes} from 'stylus'
import * as Pug from 'pug'
import {promisify} from 'util'

var renderAsync = promisify(sass.render)
// import * as Bluebird from 'bluebird'

// const compileStylus = Bluebird.Promise.promisify(stylus.render)

class VVueAddon extends VortexRTDEAPI.Addons.VortexAddon {
    constructor(name:string,handler:VortexRTDEAPI.Addons.ExportsHandler){
        super(name,handler);
    }
}

class VueComponentDependency extends VortexRTDEAPI.Dependency{

    componentName:string

    constructor(name:string,initImportLocation:VortexRTDEAPI.MDImportLocation){
        super(name,initImportLocation);
        //Finds component name from Import location! (Assuming all locations import it the same way!!!)
        this.componentName = initImportLocation.modules[0].name
    }

}


const SearchAndGraphInVueDep:VortexRTDEAPI.Addons.Grapher= async (Dependency:VortexRTDEAPI.Dependency,Graph:VortexRTDEAPI.VortexGraph,planetName:string,panel:VortexRTDEAPI.ControlPanel) => {

    let buffer = await readFile(Dependency.name)
    let file = buffer.toString()
    var {script,styles,template} = VueUtils.parse({compiler:VueTemplateCompiler,source:file,filename:Dependency.name})
    let code = await CompileComponent({script,styles,template},Dependency.name,panel)
    const entry = new VortexRTDEAPI.QueueEntry(Dependency.name,VortexRTDEAPI.ParseCode(code,{sourceType:"module"}))
    VortexRTDEAPI.addQueueEntry(entry)
    VortexRTDEAPI.NativeDependencyGrapher(VortexRTDEAPI.loadQueueEntry(entry.name),Graph,planetName) 

    return;

}

/**Compiles Parsed Vue Component into Js Code String
 * 
 * @param {RawVueComponent} component 
 * @param {string} DependencyName 
 */

async function CompileComponent(component:RawVueComponent,DependencyName:string,ControlPanel:VortexRTDEAPI.ControlPanel){

    var cssPlanet:boolean = ControlPanel.cssPlanet

    var scopeID = `data-v-${v4()}`

    var template

    if(component.template.lang !== undefined){
        switch(component.template.lang){
            case 'pug'||'jade':
                template = Pug.render(component.template.content)
                break;
        }
    } else {
        template = component.template.content
    }

    const renderFuncBody = VueUtils.compileTemplate({source:template,compiler:VueTemplateCompiler,filename:DependencyName,transformAssetUrls:true})

    const ASTRenderFuncBody = VortexRTDEAPI.ParseCode(renderFuncBody.code,{allowReturnOutsideFunction:true})

    let styled = component.styles[0] !== undefined

    if(styled) {
        var scoped = component.styles[0].scoped === undefined? false : component.styles[0].scoped

        var cssResult = component.styles[0].content

        if(component.styles[0].lang !== undefined){
            switch(component.styles[0].lang){
                case 'scss'||'sass':
                    cssResult = (await renderAsync({file:component.styles[0].content})).css.toString()
                    break;
                case 'less':
                    cssResult = (await less.render(component.styles[0].content)).css
                    break;
                // case 'stylus':
                //     cssResult = (await compileStylus(component.styles[0].content)).css
                //     break;
            }
        }

        if(scoped){
            cssResult = VueUtils.compileStyle({source:cssResult === undefined? cssResult : cssResult,preprocessLang:component.styles[0].lang,scoped,id:scopeID,filename:DependencyName}).code
        }
    }

    const MainAST = VortexRTDEAPI.ParseCode((await VortexRTDEAPI.BabelCompile(component.script.content)).code,{sourceType:"module"})

    let index = findDefaultExportExpression()

    let props = MainAST.program.body[index].declaration.properties

    for(let prop of props){
        if(prop.type === 'ObjectProperty' && prop.key === VortexRTDEAPI.ESTreeTypes.identifier('render')){
            prop.value = VortexRTDEAPI.ESTreeTypes.identifier('render')
            return;
        }
    }
    props.push(VortexRTDEAPI.ESTreeTypes.objectProperty(VortexRTDEAPI.ESTreeTypes.identifier('render'),VortexRTDEAPI.ESTreeTypes.identifier('render')))

    if(styled){
        if(scoped){
            props.push(VortexRTDEAPI.ESTreeTypes.objectProperty(VortexRTDEAPI.ESTreeTypes.identifier('_scopeId'),VortexRTDEAPI.ESTreeTypes.stringLiteral(scopeID)))
        }
    }

    MainAST.program.body.reverse()
    MainAST.program.body.push(ASTRenderFuncBody.program.body[0])
    MainAST.program.body.reverse()

    if(styled && !cssPlanet){
        MainAST.program.body.push(VortexRTDEAPI.InjectCSS({DEPNAME:VortexRTDEAPI.ESTreeTypes.stringLiteral(DependencyName),CSS:VortexRTDEAPI.ESTreeTypes.stringLiteral(cssResult)}))
    } else if(styled && cssPlanet){
        VortexRTDEAPI.pipeCSSContentToBuffer(cssResult)
    }

    return VortexRTDEAPI.GenerateCode(MainAST).code


    function findDefaultExportExpression () {
        for(let node of MainAST.program.body){
            if(node.type === 'ExportDefaultDeclaration'){
                return MainAST.program.body.indexOf(node)
            }
        }
    }

}



interface RawVueComponent {

    script:VueUtils.SFCBlock
    styles:Array<VueUtils.SFCBlock>
    template:VueUtils.SFCBlock
}

const TransformVueComponentImports:VortexRTDEAPI.Addons.ImportsTransformer = (AST:VortexRTDEAPI.ESTreeTypes.File,Dependency:VueComponentDependency,CurrentImportLocation:VortexRTDEAPI.MDImportLocation) => {

    //Lie to Native Transformer to allow transformations!!

    let newDep = new VortexRTDEAPI.EsModuleDependency(Dependency.name,Dependency.importLocations[0]);
    newDep.importLocations = Dependency.importLocations;
    return VortexRTDEAPI.TransformNativeImports(AST,CurrentImportLocation,newDep)

}

const TransformVueComponentExports:VortexRTDEAPI.Addons.ExportsTransformer = (AST:VortexRTDEAPI.ESTreeTypes.File,Dependency:VortexRTDEAPI.Dependency) => {

    VortexRTDEAPI.TraverseCode(AST,{
        ExportDefaultDeclaration: function(path){
            path.replaceWith(VortexRTDEAPI.ESTreeTypes.assignmentExpression('=',VortexRTDEAPI.ESTreeTypes.memberExpression(VortexRTDEAPI.ESTreeTypes.identifier('shuttle_exports'),VortexRTDEAPI.ESTreeTypes.identifier('MAPPED_DEFAULT')),path.node.declaration))
        }
    })

}


var EXPORTS = new VortexRTDEAPI.Addons.ExportsHandler();
var MODULE_OBJECT:VortexRTDEAPI.Addons.VortexAddonModule = {};

var VUE_DEPENDENCY:VortexRTDEAPI.Addons.CustomGraphDependencyMapObject = {extension:'.vue',dependency:VueComponentDependency, bundlable:true}

var VUE_GRAPHER:VortexRTDEAPI.Addons.CustomDependencyGrapher = {name:'.vue',grapher:SearchAndGraphInVueDep}

var VUE_TRANSFORMERS:VortexRTDEAPI.Addons.CompilerCustomDependencyMap = {extname:'.vue',importsTransformer:TransformVueComponentImports,exportsTransformer:TransformVueComponentExports}


MODULE_OBJECT.JS_EXNTS = ['.vue']
MODULE_OBJECT.CUSTOM_DEPENDENCIES = [VUE_DEPENDENCY]
MODULE_OBJECT.GRAPH_EXTSN = [VUE_GRAPHER]
MODULE_OBJECT.COMPILER_EXTSN = [VUE_TRANSFORMERS]



EXPORTS.register(MODULE_OBJECT)
var SELF = new VVueAddon('VueVortexAddon',EXPORTS)
export {SELF as VueVortexAddon}