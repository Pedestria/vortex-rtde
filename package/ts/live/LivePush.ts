/*Vortex RTDE
 LivePush 0.0.0
 Copyright Alex Topper 2020 
*/

import * as path from 'path'
import * as fs from 'fs/promises'
import {parseAsync, ParseResult, traverse, NodePath, transformAsync} from '@babel/core'
import * as t from '@babel/types'
import generate from '@babel/generator'
import * as Parse5 from 'parse5'
import * as resolve from 'resolve'
import { promisify } from 'util'
import {writeJSON} from 'fs-extra'

import * as _ from 'lodash'
import { subtract } from 'lodash'

var resolveAsync =  promisify(resolve)

var loadedModules:string[] = []



var NON_JS_EXNTS = ['.png','.css','.scss']


/**
 * The Vortex Live Package Interpreter 
 */
export class LivePush{

    name:string

    /**
     * 
     * @param {string} name Name of Interpreter
     * @param {string} dirToEntry Dir To Entry.
     * @param {string} dirToHTML Dir to HTML Page
     * @param {string} dirToControlPanel Dir to Vortex Config Panel
     */
    constructor(name:string,dirToHTML:string,dirToEntry:string){
        this.name = name
        this.run(dirToHTML,dirToEntry);
    }

    /**Intializes live interpreter.
     * 
     * @param {string} dirToHTML
     * @param {string} dirToEntry
     */

    run(dirToHTML:string,dirToEntry:string){
        initLiveDependencyTree(dirToEntry,dirToHTML).catch(err => console.log(err))
    }
}

class LiveTree {
    root:string
    branches:Array<LiveBranch> = []
    contexts:Array<LiveContext> = []
    fileBin:Array<LiveFile> = []

    ID:string
    requests:Array<ContextRequest> = []

    addBranch(branch:LiveBranch):void {
        this.branches.push(branch)
    }

    branchExists(branchMain:string):boolean {
        for(let branch of this.branches){
            if(branch.main === branchMain){
                return true
            }
        }
        return false;
    }

    removeBranch(branchMain:string):void {
        this.branches.filter(branch => branch.main !== branchMain)
    }

    contextExists(contextID:string){
        for(let context of this.contexts){
            if(context.provider === contextID){
                return true;
            }
        }
        return false;
    }

    loadContext(contextID:string){
        for(let context of this.contexts){
            if(context.provider === contextID){
                return context
            }
        }
    }

    replaceContext(contextID:string,newContext:LiveContext){
        for(let context of this.contexts){
            if(context.provider === contextID){
                context = newContext
                return;
            }
        }
    }

}

interface LiveBranch {

    main:string
    branches?:Array<LiveBranch>
    fileBin:Array<LiveFile>

    addBranch(branch:LiveBranch):void;

    branchExists(branchMain:string):boolean

    removeBranch(branchMain:string):void

}

interface LiveAddress {
    ID:string
    requests:Array<ContextRequest>
}

interface LiveContext {

    provider:string
    addresses:Array<string>

    /**Adds Address to Context
     * 
     * @param {LiveBranch} branch 
     */

    addAddress(address:LiveAddress):void

    /**Verifies if Address exists.
     * 
     * @param {string} addressID
     */


    addressExists(addressID:string):boolean

    /**Removes Address from Context
     * 
     * @param {string} addressID
     */

    removeAddress(addressID:string):void





}

class ModuleContext implements LiveContext {
    provider: string;
    addresses: string[] = [];

    addAddress(address: LiveAddress): void {
        this.addresses.push(address.ID)
    }
    addressExists(addressID: string): boolean {
        for(let ID of this.addresses){
            if(ID === addressID){
                return true
            }
        }
        return false;
    }
    removeAddress(addressID: string): void {
        this.addresses.filter(ID => ID !== addressID)
    }

}

class CSSContext implements LiveContext {
    provider: string;
    addresses: string[] = [];

    addAddress(address: LiveAddress): void {
        this.addresses.push(address.ID)
    }
    addressExists(addressID: string): boolean {
        for(let ID of this.addresses){
            if(ID === addressID){
                return true
            }
        }
        return false;
    }
    removeAddress(addressID: string): void {
        this.addresses.filter(ID => ID !== addressID)
    }
    
}

class LiveModule implements LiveBranch, LiveAddress {
    main: string;
    branches?: LiveBranch[] = [];
    fileBin:Array<LiveFile> = []
    libLoc?:string

    ID: string;
    requests: ContextRequest[] = [];

    constructor(source:string){
        this.main = source
        this.ID = source
    }

    addBranch(branch:LiveBranch):void {
        this.branches.push(branch)
    }
    branchExists(branchMain:string):boolean {
        for(let branch of this.branches){
            if(branch.main === branchMain){
                return true
            }
        }
        return false;
    }
    removeBranch(branchMain:string):void {
        this.branches.filter(branch => branch.main !== branchMain)
    }

    
}

class LiveCSS implements LiveBranch {
    main: string;
    branches?: LiveBranch[] = [];
    fileBin:Array<LiveFile> = []

    constructor(source:string){
        this.main = source
    }

    addBranch(branch:LiveBranch):void {
        this.branches.push(branch)
    }
    branchExists(branchMain:string):boolean {
        for(let branch of this.branches){
            if(branch.main === branchMain){
                return true
            }
        }
        return false;
    }
    removeBranch(branchMain:string):void {
        this.branches.filter(branch => branch.main !== branchMain)
    }

}

interface LiveFile {
    fileLocation:string
}


interface LPEntry {
    name:string,
    ast:ParseResult
}

interface ContextRequest {
    contextID:string
    requests:Array<string>
    namespaceRequest:string
    type:'Module'|'CSS'
}


function isModule(moduleName:string){

    if(NON_JS_EXNTS.includes(path.extname(moduleName))){
        return false
    } else if (!path.extname(moduleName)){
        return true
    } else if (path.extname(moduleName).includes('.js') || path.extname(moduleName).includes('.mjs')){
        return true
    }

}

function ResolveRelative(from:string,to:string){
    return './'+path.join(path.dirname(from),to)
}
function addJSExtIfPossible(filename:string){
    return filename.includes('.js')|| filename.includes('.mjs')? filename : filename+'.js'
}


async function resolveNodeLibrary(nodelibName:string){

    let stage1:string = await resolveAsync(nodelibName)

    let stage2 = await RelayFetch(stage1)

    if(stage2.length === 0){
        return stage1
    } else {
        return stage2[0]
    }

}

async function RelayFetch(index:string){

    const ast = await parseAsync((await fs.readFile(index)).toString())

    let GLOBAL_RESOLVE = path.join

    let DIRNAME = path.dirname


    let exports:string[] = []

    traverse(ast, {
        AssignmentExpression: function(path){
            if(path.node.left.type === "MemberExpression" && path.node.left.object.type === 'Identifier' 
            && path.node.left.object.name === 'module' && path.node.left.property.name === 'exports' 
            && path.node.right.type === 'CallExpression' && path.node.right.callee.type === 'Identifier' && path.node.right.callee.name === 'require'){
                exports.push(GLOBAL_RESOLVE(DIRNAME(index),path.node.right.arguments[0].value))
            }
        }
    })

    return exports.filter(lib => !lib.includes('prod')&&!lib.includes('min'))
}

function pushRequests(currentBranch:LiveAddress&LiveBranch|LiveTree,path:NodePath<t.ImportDeclaration>|NodePath<t.VariableDeclarator>,context:LiveContext){

    let type:"Module"|"CSS" = "Module"
    let namespaceRequest:string

    if(context.provider.includes('.css')){
        type = "CSS"
    }

    //ES IMPORT CHECK!!

    if(path.node.type === "ImportDeclaration"){
        if(path.node.specifiers.length === 0){
            currentBranch.requests.push({contextID:context.provider,requests:[],type,namespaceRequest:null})
            return;
        }

        let imports = path.node.specifiers.map(imp => imp.local.name)
        if(path.node.specifiers[0].type === 'ImportDefaultSpecifier' && imports.length > 1 || !context.provider.includes('./')){
            namespaceRequest = imports[0]
        }

        currentBranch.requests.push({contextID:context.provider,requests:imports,type,namespaceRequest})

        return;
        //COMMON JS IMPORT CHECK!!
    } else if(path.node.type === "VariableDeclarator"){
        currentBranch.requests.push({contextID:context.provider,requests:[path.node.id.name],type,namespaceRequest:path.node.id.name})
    }

}

/**Manages Live Tree addtions/removals
 * 
 * @param {string} name 
 * @param {LiveAddress&LiveBranch|LiveTree} currentBranch 
 * @param {LiveTree} tree 
 * @param {boolean} isTree 
 * @param {NodePath<t.ImportDeclaration>|NodePath<t.AssignmentExpression>} path
 */

function TreeBuilder(name:string,currentBranch:LiveAddress&LiveBranch|LiveTree,tree:LiveTree,isTree:boolean,path:NodePath<t.ImportDeclaration>|NodePath<t.VariableDeclarator>){

            let module
            var file:LiveFile


            if(isModule(name)){
                name = name.includes('./')? addJSExtIfPossible(name) : name
                module = new LiveModule(name);
            } else if(name.includes('.css')) {
                module = new LiveCSS(name);
            } else {
                file = {fileLocation:name}
            }

            //If is live Branch
            if(!isTree){
                if(tree.contextExists(name)){

                    let context = tree.loadContext(name)
                    if(!context.addressExists(currentBranch.ID)){
                        context.addAddress(currentBranch)
                    }

                    pushRequests(currentBranch,path,context)
                }
                else {
                    let context
                    if(module){
                        if(module instanceof LiveCSS){
                            context = new CSSContext();
                        }
                        else {
                            context = new ModuleContext();
                            context.provider = name
                        }
                        context.addAddress(currentBranch) 

                        tree.contexts.push(context)

                        pushRequests(currentBranch,path,context)
                    }
                }
                //If Live Tree
            } else {
                let context
                if(module){
                    if(module instanceof LiveCSS){
                        context = new CSSContext();
                    }
                    else {
                        context = new ModuleContext();
                    }
                    context.provider = name;
                    context.addAddress(currentBranch)
                    currentBranch.contexts.push(context)
                    pushRequests(currentBranch,path,context)
                }   
            }

            if(!module){
                currentBranch.fileBin.push(file)
            }
            else {
                currentBranch.addBranch(module)
            }


}

function TraverseAndTransform(entry:LPEntry,currentBranch:LiveBranch&LiveAddress|LiveTree,tree?:LiveTree){

    var isTree = false

    if(currentBranch instanceof LiveTree){
        isTree = true
    }

    traverse(entry.ast, {
        ImportDeclaration: function(path) {
            let name = path.node.source.value.includes('./')? ResolveRelative(entry.name,path.node.source.value) : path.node.source.value
            TreeBuilder(name,currentBranch,tree,isTree,path)
            path.remove()
        },
        VariableDeclarator: function(path){
            if(path.node.init !== null && path.node.init.type === 'CallExpression' && path.node.init.callee.type === 'Identifier' && path.node.init.callee.name === 'require'){
                let name = path.node.init.arguments[0].value.includes('./') && entry.name.includes('./')? ResolveRelative(entry.name,path.node.init.arguments[0].value) : path.node.init.arguments[0].value
                TreeBuilder(name,currentBranch,tree,isTree,path)
                path.remove()
            }
        },
        MemberExpression: function(path){
            if(path.node.object.type === 'MemberExpression' && path.node.object.object.type === 'Identifier' && path.node.object.object.name === 'process' 
            && path.node.object.property.name === 'env' && path.node.property.name === 'NODE_ENV'){
                path.replaceWith(t.stringLiteral('live'));
            }
        }
    })

}

async function RecursiveTraverse(branch:LiveModule,liveTree:LiveTree,queue:LPEntry[]){

    for(let subBranch of branch.branches){
        if(subBranch instanceof LiveModule){
            if(!loadedModules.includes(subBranch.main)) {
                if(subBranch.main.includes('./')){
                    let location = branch.libLoc? path.join(path.dirname(branch.libLoc),subBranch.main) : ResolveRelative(branch.main,subBranch.main)
                    let ENTRY:LPEntry = {name:subBranch.main,ast:await parseAsync((await fs.readFile(location)).toString(),{sourceType:"module",presets:['@babel/preset-react']})}
                    queue.push(ENTRY)
                    TraverseAndTransform(ENTRY,subBranch,liveTree)

                    if(subBranch.branches.length > 0){
                        await RecursiveTraverse(subBranch,liveTree,queue)
                    }

                    loadedModules.push(subBranch.main)

                } else {
                    let libLoc = await resolveNodeLibrary(subBranch.main)
                    subBranch.libLoc = libLoc
                    let ENTRY:LPEntry = {name:subBranch.main,ast:await parseAsync((await fs.readFile(libLoc)).toString(),{sourceType:"module",presets:['@babel/preset-react']})}
                    queue.push(ENTRY)
                    TraverseAndTransform(ENTRY,subBranch,liveTree)

                    if(subBranch.branches.length > 0){
                        await RecursiveTraverse(subBranch,liveTree,queue)
                    }

                    loadedModules.push(subBranch.main)
                }
            }
        }
    }

}

function normalizeModuleName(name:string){
    let NASTY_CHARS = "\\./@^$#*&!%-"
    for(let char of name){
        if(NASTY_CHARS.includes(char)){
            let a = name.slice(0,name.indexOf(char))
            let b = name.slice(name.indexOf(char)+1)
            name = `${a}_${b}`
        }
    }

    return name
}


async function initLiveDependencyTree(root:string,dirToHtml:string){


    var queue:Array<LPEntry> = []

    function fetchLPEntry(entry_name:string){
        for(let ent of queue){
            if(ent.name === entry_name){
                return ent
            }
        }
    }

    function fetchAddressFromTree(addressID:string,tree_OR_branch:LiveTree|LiveModule){
        if(tree_OR_branch.ID === addressID){
            return tree_OR_branch
        }

        for(let branch of tree_OR_branch.branches){
            if(branch instanceof LiveModule){
                if(branch.ID === addressID){
                    return branch
                }
                else{
                    fetchAddressFromTree(addressID,branch)
                }
            }
        }
    }

    function loadRequestFromAddress(address:LiveAddress,context_ID:string){
        for(let request of address.requests){
            if(request.contextID === context_ID){
                return request
            }
        }
    }
    
    var liveTree = new LiveTree();
    liveTree.root = root
    liveTree.ID = root

    var transformed = (await transformAsync((await fs.readFile(root)).toString(),{sourceType:"module",presets:['@babel/preset-react']})).code

    var rootEntry:LPEntry = {name:root,ast:await parseAsync(transformed,{sourceType:"module"})}
    queue.push(rootEntry)
    loadedModules.push(root)

    TraverseAndTransform(rootEntry,liveTree)

    for(let branch of liveTree.branches){
        if(branch instanceof LiveModule){
            if(!loadedModules.includes(branch.main)) {
                if(branch.main.includes('./')){
                    let ENTRY:LPEntry = {name:branch.main,ast:await parseAsync((await fs.readFile(branch.main)).toString(),{sourceType:"module",presets:['@babel/preset-react']})}
                    queue.push(ENTRY)
                    TraverseAndTransform(ENTRY,branch,liveTree)

                    if(branch.branches.length > 0){
                        await RecursiveTraverse(branch,liveTree,queue)
                    }
                    loadedModules.push(branch.main)

                } else {
                    let libLoc = await resolveNodeLibrary(branch.main)
                    branch.libLoc = libLoc
                    let ENTRY:LPEntry = {name:branch.main,ast:await parseAsync((await fs.readFile(libLoc)).toString(),{sourceType:"module",presets:['@babel/preset-react']})}
                    queue.push(ENTRY)
                    TraverseAndTransform(ENTRY,branch,liveTree)

                    if(branch.branches.length > 0){
                        await RecursiveTraverse(branch,liveTree,queue)
                    }

                    loadedModules.push(branch.main)
                }
            }
        }
    }

    for(let context of liveTree.contexts){
        if(context instanceof ModuleContext){
            for(let address of context.addresses){
                let ast:t.File = fetchLPEntry(address).ast
                let module = fetchAddressFromTree(address,liveTree)
                if(module instanceof LiveModule || module instanceof LiveTree){
                    let contextRequest = loadRequestFromAddress(module,context.provider)
                    
                    if(contextRequest.type === 'Module'){
                        //Build Imports
                        let imports:t.VariableDeclarator[] = []

                        let newName = normalizeModuleName(context.provider.toUpperCase())

                        let declarator 

                        if(contextRequest.namespaceRequest){
                            declarator = t.variableDeclarator(t.identifier(newName),t.callExpression(t.identifier('loadExports'),[t.stringLiteral(context.provider),t.stringLiteral(contextRequest.namespaceRequest)]))
                        } else{
                            declarator = t.variableDeclarator(t.identifier(newName),t.callExpression(t.identifier('loadExports'),[t.stringLiteral(context.provider)]))
                        }

                        imports.push(declarator)
                        for(let request of contextRequest.requests){
                            imports.push(t.variableDeclarator(t.identifier(request),t.memberExpression(t.identifier(newName),t.identifier(request))))
                        }

                        ast.program.body.reverse()
                        ast.program.body.push(t.variableDeclaration('var',imports))
                        ast.program.body.reverse()
                    }
                }
            }
        }
    }

    let factory:string = `var loadedModules = [];
    var loadedExportsByModule = {};
  
    function loadExports(module0, namespace) {
      if (loadedModules.includes(module0)) {
        if (namespace && !loadedExportsByModule[module0].cachedExports.exports) {
          var namespace0 = {};
          Object.defineProperty(namespace0, namespace, {
            writable: false,
            enumerable: true,
            value: loadedExportsByModule[module0].cachedExports
          });
          var obj = Object.entries(loadedExportsByModule[module0].cachedExports).concat(Object.entries(namespace0));
          return Object.fromEntries(obj);
        } else if(namespace && loadedExportsByModule[module0].cachedExports.exports) {
          var namespace0 = {};
          Object.defineProperty(namespace0, namespace, {
            writable: false,
            enumerable: true,
            value: loadedExportsByModule[module0].cachedExports.exports
          });
          console.log(namespace0)
          return namespace0;
        }
        else {
          return loadedExportsByModule[module0].cachedExports;
        }
      } else {
        //Named Exports
        var exports = {}; //Default Export
  
        var module = {};
  
        live_modules[module0](loadExports,exports,module);
  
        if (module0.includes('./')) {
          var obj = {};
          Object.defineProperty(obj, namespace, {
            value: module,
            enumerable: true
          });
  
          if (namespace) {
            var exps = Object.assign(exports, obj);
            cacheExports(module0, exps);
            return exps;
          } else {
            var exps = Object.assign(exports, module.exports);
            cacheExports(module0, exps);
            return exps;
          }
        } else {
          if (namespace && module.exports && Object.entries(module).length > 1) {
            var finalNamespace = {};
            Object.defineProperty(finalNamespace, namespace, {
              value: exports,
              enumerable: true,
              writable: false
            });
            var entries = Object.entries(exports).concat(Object.entries(finalNamespace));
            var exps = Object.fromEntries(entries);
            cacheExports(module0, exports);
            return exps;
  
          }else if (namespace && module.exports && Object.entries(module).length === 1){
            var finalName = {};
            cacheExports(module0,module);
            Object.defineProperty(finalName,namespace, {
              value:module.exports,
              enumerable:true,
              writable:false
            });
            return finalName
  
        } else if(namespace && !module.exports){
          var finalNamespac1 = {};
          Object.defineProperty(finalNamespac1,namespace, {
            value:exports,
            enumerable:true,
            writable:false
          })
  
          var entries = Object.entries(exports).concat(Object.entries(finalNamespac1))
          cacheExports(module0,exports)
          var exps = Object.fromEntries(entries)
          return exps
        } 
        else if (Object.entries(exports).length > 0) {
            cacheExports(module0, exports);
            return exports;
          } else if (module.exports && Object.entries(module).length > 0) {
            cacheExports(module0, module);
            return module;
          }
        }
      }
    }
  
    function cacheExports(mod_name, mod_exports) {
      var o = new Object(mod_name);
      Object.defineProperty(o, 'cachedExports', {
        value: mod_exports,
        writable: false
      });
      Object.defineProperty(loadedExportsByModule, mod_name, {
        value: o
      });
      loadedModules.push(mod_name);
    }
  
    return loadExports('${liveTree.root}');`

    let parsedFactory =  (await parseAsync(factory,{sourceType:'module',parserOpts:{allowReturnOutsideFunction:true}})).program.body

    
    let buffer:t.ObjectProperty[] = []

    for(let ent of queue){
        buffer.push(t.objectProperty(t.stringLiteral(ent.name),t.callExpression(t.identifier(''),[t.functionExpression(null,[t.identifier('loadExports'),t.identifier('exports'),t.identifier('module')],t.blockStatement(ent.ast.program.body))])))
    }

    let final0 = t.objectExpression(buffer);

    let final1 = generate(t.expressionStatement(t.callExpression(t.identifier(''),[t.callExpression(t.functionExpression(null,[t.identifier('live_modules')],t.blockStatement(parsedFactory)),[final0])])))

    // const document:Parse5.DefaultTreeDocument = Parse5.parse((await fs.readFile(dirToHtml)).toString())

    // const body:Parse5.Node = document.childNodes[1]

    // console.log(body.)

    await fs.writeFile('./test/live_bundle.js',final1.code)
    console.log('Yipee!')




    // await writeJSON('./Livetree.json',liveTree);
    // console.log('Yipee!')
    

}
