import { VortexAddon, ExportsHandler, VortexAddonModule, CustomDependencyGrapher, CustomGraphDependencyMapObject, Grapher, ImportsTransformer, Transformer, CompilerCustomDependencyMap } from "../Addon";
import * as API from '../API'
import {readFile} from 'fs/promises'
import * as VueUtils from '@vue/component-compiler-utils'
import { v4 } from "uuid";
const VueTemplateCompiler = require('vue-template-compiler')
import * as sass from 'node-sass'
import * as less from 'less'
// import {nodes} from 'stylus'
import * as Pug from 'pug'
// import * as Bluebird from 'bluebird'

// const compileStylus = Bluebird.Promise.promisify(stylus.render)

export class VVueAddon extends VortexAddon {
    constructor(name:string,handler:ExportsHandler){
        super(name,handler);
    }
}

class VueComponentDependency extends API.Dependency{

    componentName:string

    constructor(name:string,initImportLocation:API.MDImportLocation){
        super(name,initImportLocation);
        //Finds component name from Import location! (Assuming all locations import it the same way!!!)
        this.componentName = initImportLocation.modules[0].name
    }

}


const SearchAndGraphInVueDep:Grapher = async (Dependency:API.Dependency,Graph:API.VortexGraph,planetName?:string) => {

    let buffer = await readFile(Dependency.name)
    let file = buffer.toString()
    var {script,styles,template} = VueUtils.parse({compiler:VueTemplateCompiler,source:file,filename:Dependency.name})
    let code = await CompileComponent({script,styles,template},Dependency.name)
    const entry = new API.QueueEntry(Dependency.name,API.ParseCode(code,{sourceType:"module"}))
    API.addQueueEntry(entry)
    API.NativeDependencyGrapher(API.loadQueueEntry(entry.name),Graph,planetName) 

    return;

}

/**Compiles Parsed Vue Component into Js Code String
 * 
 * @param {RawVueComponent} component 
 * @param {string} DependencyName 
 */

async function CompileComponent(component:RawVueComponent,DependencyName:string){

    var cssPlanet:boolean = API.ControlPanel.cssPlanet

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

    const ASTRenderFuncBody = API.ParseCode(renderFuncBody.code,{allowReturnOutsideFunction:true})

    let styled = component.styles[0] !== undefined

    if(styled) {
        var scoped = component.styles[0].scoped === undefined? false : component.styles[0].scoped

        var cssResult = component.styles[0].content

        if(component.styles[0].lang !== undefined){
            switch(component.styles[0].lang){
                case 'scss'||'sass':
                    cssResult = sass.renderSync({file:component.styles[0].content}).css.toString()
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

    const MainAST = API.ParseCode((await API.BabelCompile(component.script.content)).code,{sourceType:"module"})

    let index = findDefaultExportExpression()

    let props = MainAST.program.body[index].declaration.properties

    for(let prop of props){
        if(prop.type === 'ObjectProperty' && prop.key === API.BabelTypes.identifier('render')){
            prop.value = API.BabelTypes.identifier('render')
            return;
        }
    }
    props.push(API.BabelTypes.objectProperty(API.BabelTypes.identifier('render'),API.BabelTypes.identifier('render')))

    if(styled){
        if(scoped){
            props.push(API.BabelTypes.objectProperty(API.BabelTypes.identifier('_scopeId'),API.BabelTypes.stringLiteral(scopeID)))
        }
    }

    MainAST.program.body.reverse()
    MainAST.program.body.push(ASTRenderFuncBody.program.body[0])
    MainAST.program.body.reverse()

    if(styled && !cssPlanet){
        MainAST.program.body.push(API.InjectCSS({DEPNAME:API.BabelTypes.stringLiteral(DependencyName),CSS:API.BabelTypes.stringLiteral(cssResult)}))
    } else if(styled && cssPlanet){
        API.pipeCSSContentToBuffer(cssResult)
    }

    return API.GenerateCode(MainAST).code


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

const TransformVueComponentImports:ImportsTransformer = (AST:API.BabelTypes.File,Dependency:VueComponentDependency,CurrentImportLocation:API.MDImportLocation) => {

    //Lie to Native Transformer to allow transformations!!

    let newDep = new API.EsModuleDependency(Dependency.name,Dependency.importLocations[0]);
    newDep.importLocations = Dependency.importLocations;
    return API.TransformNativeImports(AST,CurrentImportLocation,newDep)

}

const TransformVueComponentExports:Transformer = (AST:API.BabelTypes.File,Dependency:API.Dependency) => {

    API.TraverseCode(AST,{
        ExportDefaultDeclaration: function(path){
            path.replaceWith(API.BabelTypes.assignmentExpression('=',API.BabelTypes.memberExpression(API.BabelTypes.identifier('shuttle_exports'),API.BabelTypes.identifier('MAPPED_DEFAULT')),path.node.declaration))
        }
    })

}


var EXPORTS = new ExportsHandler()
var MODULE_OBJECT:VortexAddonModule = {};

var VUE_DEPENDENCY:CustomGraphDependencyMapObject = {extension:'.vue',dependency:VueComponentDependency, bundlable:true}

var VUE_GRAPHER:CustomDependencyGrapher = {name:'.vue',grapher:SearchAndGraphInVueDep}

var VUE_TRANSFORMERS:CompilerCustomDependencyMap = {extname:'.vue',importsTransformer:TransformVueComponentImports,exportsTransformer:TransformVueComponentExports}


MODULE_OBJECT.JS_EXNTS = ['.vue']
MODULE_OBJECT.CUSTOM_DEPENDENCIES = [VUE_DEPENDENCY]
MODULE_OBJECT.GRAPH_EXTSN = [VUE_GRAPHER]
MODULE_OBJECT.COMPILER_EXTSN = [VUE_TRANSFORMERS]



EXPORTS.register(MODULE_OBJECT)
var SELF = new VVueAddon('VueVortexAddon',EXPORTS)
export {SELF as VueVortexAddon}