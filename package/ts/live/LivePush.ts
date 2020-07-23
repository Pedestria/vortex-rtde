/*Vortex RTDE
 LivePush 0.2.0
 Copyright Alex Topper 2020 
*/

import * as path from 'path'
import * as fs from 'fs/promises'
import {parseAsync, ParseResult, traverse, NodePath, transformAsync, ParserOptions} from '@babel/core'
import * as t from '@babel/types'
import generate from '@babel/generator'
import * as Parse5 from 'parse5'
import * as resolve from 'resolve'
import { promisify } from 'util'
import {Express} from 'express'
import * as ora from 'ora'
import * as chalk from 'chalk'
import * as chokidar from 'chokidar'
import {diffLines, Change} from 'diff'
import {platform} from 'os'
import * as IO from 'socket.io'

import * as _ from 'lodash'
import cliSpinners = require('cli-spinners')

var resolveAsync =  promisify(resolve)
var diffLinesAsync = promisify(diffLines)

var LooseParseOptions:ParserOptions = {sourceType:"module",allowReturnOutsideFunction:true,allowImportExportEverywhere:true,allowSuperOutsideMethod:true,allowAwaitOutsideFunction:true,allowUndeclaredExports:true}

var loadedModules:string[] = []

var queue:Array<LPEntry> = []


var NON_JS_EXNTS = ['.png','.css','.scss']

var INITSTAGE = `
    ============================= 
                            
        Welcome To LivePush!
                        
    =============================
`


/**
 * 
 * The Vortex Live Updater!
 * 
 */
export class LivePush{

    name:string

    /**
     * 
     * @param {string} name Name of Interpreter
     * @param {string} dirToEntry Dir To Entry. **(Resolved PLEASE!)**
     * @param {string} dirToHTML Dir to HTML Page **(Resolved PLEASE!)**
     * @param {string} dirToControlPanel Dir to Vortex Config Panel
     * @param {Express} expressRouter
     */
    constructor(name:string,dirToHTML:string,dirToEntry:string,expressRouter:Express){
        this.name = name;
        this.run(dirToHTML,dirToEntry,expressRouter);
    }

    /**
     * Intializes live interpreter.
     * @param {string} dirToHTML
     * @param {string} dirToEntry
     * @param {Express} router
     */

    run(dirToHTML:string,dirToEntry:string,router:Express){

        //Start Spinner!

        const initStage = ora({prefixText:chalk.yellowBright("Initializing..."),spinner:cliSpinners.dots10});
        initStage.start();

        //Init LivePush!

        initLiveDependencyTree(dirToEntry,dirToHTML).then(LiveTree => {
            router.get('/*',(req,res) => {res.sendFile(dirToHTML)});
            initStage.stop();
            console.log(chalk.greenBright(INITSTAGE))

            initWatch(LiveTree,router,dirToHTML);
        }).catch(err => console.log(err));
    }

}

interface CodeEntry {
    name:string
    code:string
}

interface ImportsMemory {
    address:string
    imports:IMPORT[]
}

interface IMPORT {
    name:string
    varDeclaration:t.VariableDeclaration
}

class LiveTree {

    factory: any

    memory:ImportsMemory[] = []

    /**
     * The pre-processed local file code.
     */
    preProcessQueue:Array<CodeEntry> = []

    moduleBuffer:Array<t.ObjectProperty> = []

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

    removeContext(contextID:string){
        this.contexts.filter(context => context.provider !== contextID);
    }

    memoryExists(address:string):boolean{
        if(this.memory.find(mem => mem.address === address)){
            return true
        } else{
            return false
        }
    }

    loadMemory(address:string){
        return this.memory.find(mem => mem.address === address)
    }

    addMemory(mem:ImportsMemory){
        this.memory.push(mem);
    }

    addImportToMemory(address:string,IMPORT:t.VariableDeclaration,importFrom:string){
        this.memory.find(mem => mem.address === address).imports.push({name:importFrom,varDeclaration:IMPORT});
    }

    refreshMemory(address:string,IMPORTS:IMPORT[]){
        this.memory.find(mem => mem.address === address).imports = IMPORTS;
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
                    let location = branch.libLoc? path.join(path.dirname(branch.libLoc),subBranch.main) : ResolveRelative(branch.main,subBranch.main);

                    let transformed = (await transformAsync((await fs.readFile(location)).toString(),{sourceType:"module",presets:['@babel/preset-react'],plugins:['@babel/plugin-proposal-class-properties']})).code

                    liveTree.preProcessQueue.push({name:location,code:transformed});

                    let ENTRY:LPEntry = {name:subBranch.main,ast:await parseAsync(transformed,{sourceType:"module",presets:['@babel/preset-react']})}
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

/**
 * Create a Live Tree.
 * @param {string} root Entry Point
 * @param dirToHtml Directory to HTML Page 
 */

async function initLiveDependencyTree(root:string,dirToHtml:string): Promise<LiveTree>{

    var ROOT = amendEntryPoint(root);
    var ROOT2 = amendEntryPoint2(root);

    function amendEntryPoint(entry:string){
        if(platform() !== "win32"){
            return entry
        } else {
            let shortEntry = entry.slice(2)
        
            while(shortEntry.includes('/')){
                let i = shortEntry.indexOf('/')
                let a = shortEntry.slice(0,i)
                let b = shortEntry.slice(i+1)
                shortEntry = `${a}\\${b}`
            }
            return `./${shortEntry}`
        }
    }
    function amendEntryPoint2(entry:string){
        if(platform() !== "win32"){
            return entry
        } else {
            let shortEntry = entry.slice(2)
        
            while(shortEntry.includes('/')){
                let i = shortEntry.indexOf('/')
                let a = shortEntry.slice(0,i)
                let b = shortEntry.slice(i+1)
                shortEntry = `${a}\\\\${b}`
            }
            return `./${shortEntry}`
        }
    }

    
    var liveTree = new LiveTree();
    liveTree.root = ROOT
    liveTree.ID = ROOT

    var transformed = (await transformAsync((await fs.readFile(ROOT)).toString(),{sourceType:"module",presets:['@babel/preset-react'],plugins:['@babel/plugin-proposal-class-properties']})).code

    liveTree.preProcessQueue.push({name:ROOT,code:transformed});

    var rootEntry:LPEntry = {name:ROOT,ast:await parseAsync(transformed,{sourceType:"module"})}
    queue.push(rootEntry)
    loadedModules.push(ROOT)

    TraverseAndTransform(rootEntry,liveTree)

    for(let branch of liveTree.branches){
        if(branch instanceof LiveModule){
            if(!loadedModules.includes(branch.main)) {
                if(branch.main.includes('./')){
                    let transformed = (await transformAsync((await fs.readFile(branch.main)).toString(),{sourceType:"module",presets:['@babel/preset-react'],plugins:['@babel/plugin-proposal-class-properties']})).code

                    liveTree.preProcessQueue.push({name:branch.main,code:transformed});

                    let ENTRY:LPEntry = {name:branch.main,ast:await parseAsync(transformed,{sourceType:"module",presets:['@babel/preset-react']})}
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

                        let VARDEC = t.variableDeclaration('var',imports)

                        ast.program.body.unshift(VARDEC)

                        if(liveTree.memoryExists(address)){
                            liveTree.addImportToMemory(address,VARDEC,context.provider);
                        }else {
                            liveTree.addMemory({address,imports:[{varDeclaration:VARDEC,name:context.provider}]});
                        }
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
  
    return loadExports('${platform() === "win32"? ROOT2 : ROOT}');`

    let parsedFactory =  (await parseAsync(factory,{sourceType:'module',parserOpts:{allowReturnOutsideFunction:true}})).program.body

    liveTree.factory = parsedFactory;

    
    let buffer:t.ObjectProperty[] = []

    for(let ent of queue){
        buffer.push(t.objectProperty(t.stringLiteral(ent.name),t.callExpression(t.identifier(''),[t.functionExpression(null,[t.identifier('loadExports'),t.identifier('exports'),t.identifier('module')],t.blockStatement(ent.ast.program.body))])))
    }

    liveTree.moduleBuffer = buffer

    let final0 = t.objectExpression(buffer);

    let final1 = generate(t.expressionStatement(t.callExpression(t.identifier(''),[t.callExpression(t.functionExpression(null,[t.identifier('live_modules')],t.blockStatement(parsedFactory)),[final0])])))

    await appendToHTMLPage(dirToHtml,final1.code);

    return liveTree;

}

async function appendToHTMLPage(dirToHTML:string,livePushPackage:string){

    let fileloc = path.dirname(dirToHTML)+'/LIVEPUSH.js'

    await fs.writeFile(fileloc,livePushPackage);

    const document = Parse5.parse((await fs.readFile(dirToHTML)).toString())

    const HTML:Parse5.DefaultTreeNode = document.childNodes[0]

    const PackageScript:Parse5.DefaultTreeNode = {nodeName:"script",tagName:"script",attrs:[{name:"src",value:'./LIVEPUSH.js'}]}

    if(HTML.childNodes[0].nodeName === "body"){
        HTML.childNodes[0].childNodes.push(PackageScript);
    }
    else if(HTML.childNodes[0].nodeName === "head" && HTML.childNodes[1].nodeName === "body"){
        HTML.childNodes[1].childNodes.push(PackageScript);
    }

    const result = Parse5.serialize(document);

    await fs.writeFile(dirToHTML,result);

    return;

}

async function initWatch(Tree:LiveTree,router:Express,htmlDir:string){

    const watcher = ora({prefixText:'Watching Files...',spinner:cliSpinners.bounce})

    var TREE = Tree

    const pushStage = ora({prefixText:chalk.yellowBright('Pushing...'),spinner:cliSpinners.bouncingBar});


    // Modules to Watch (Includes Entry Point!)
    var modulesToWatch = loadedModules.filter(filename => filename.includes('./'))

    var Watcher = new chokidar.FSWatcher({persistent:true})

    Watcher.add(modulesToWatch);

    watcher.start();

    let PreProcessQUEUE = TREE.preProcessQueue.filter(entry => entry.name.includes('./'));

    Watcher.on("change",(filename) => {
        filename = './'+filename
        // console.log(`${filename} has been Changed!`)
        watcher.stop();
        pushStage.start();

        updateTree(filename,TREE,PreProcessQUEUE,htmlDir).then(LiveTree => {
            TREE = LiveTree;

            pushStage.succeed();
            console.log(chalk.greenBright("Successfully Pushed Changes!"))
            watcher.start();
        }).catch(err => {
            console.log(err)
        })
    })


}

async function updateTree(filename:string,liveTree:LiveTree,preProcessQueue:Array<CodeEntry>,dirToHTML:string) {
    
    let newFile = (await transformAsync((await fs.readFile(filename)).toString(),{sourceType:'module',presets:['@babel/preset-react'],plugins:['@babel/plugin-proposal-class-properties']})).code

    let oldTrans = preProcessQueue.find(entry => entry.name === filename).code

    var CHANGES:Array<Change> = await diffLinesAsync(oldTrans,newFile);

    var REQUESTDIFF = await diffRequests(CHANGES);

    preProcessQueue.find(entry => entry.name === filename).code = newFile;

    let AST:t.File = await parseAsync(newFile,{sourceType:'module',parserOpts:{strictMode:false}});

    removeImportsFromAST(AST);

    fetchLPEntry(filename).ast = AST;


    if(REQUESTDIFF.length > 0){

        let REMOVED_OR_MODIFIED_IMPORTNAMES:string[] = [];

        let NEWMEMORYIMPORTS:IMPORT[] = []

        for(let reqDiff of REQUESTDIFF){
            //Import has been added!
            if(reqDiff.added){
                if(liveTree.contextExists(reqDiff.source)){
                    let context = liveTree.loadContext(reqDiff.source)
                    let module = fetchAddressFromTree(filename,liveTree)
                    let cntRqt:ContextRequest = {contextID:context.provider,requests:reqDiff.newRequests,type:'Module',namespaceRequest:reqDiff.namespace};
                    context.addAddress(module);
                    module.requests.push(cntRqt);
                    
                    await buildImports(AST,cntRqt,context,NEWMEMORYIMPORTS);

                } else {
                    let context = new ModuleContext();
                    context.provider = reqDiff.source.includes('./')? ResolveRelative(filename,reqDiff.source) : reqDiff.source;
                    let module = fetchAddressFromTree(filename,liveTree);
                    context.addAddress(module)
                    let cntRqt:ContextRequest = {contextID:context.provider,requests:reqDiff.newRequests,type:'Module',namespaceRequest:reqDiff.namespace};
                    module.requests.push(cntRqt)
                    liveTree.contexts.push(context);

                    await buildImports(AST,cntRqt,context,NEWMEMORYIMPORTS);
                }
                //Import has been removed!
            } else if(reqDiff.removed){
                REMOVED_OR_MODIFIED_IMPORTNAMES.push(reqDiff.source);
                let context = liveTree.loadContext(reqDiff.source);
                let module:LiveModule = fetchAddressFromTree(filename,liveTree);
                context.removeAddress(module.main);
                module.requests.filter(contextrequest => contextrequest.contextID !== context.provider);

                if(context.addresses.length === 0){
                    liveTree.removeContext(context.provider);
                }
                //Import requests have been modified!
            } else {
                REMOVED_OR_MODIFIED_IMPORTNAMES.push(reqDiff.source);
                let context = liveTree.loadContext(reqDiff.source);
                let contextRequest = fetchAddressFromTree(filename,liveTree).requests.find(contextrequest => contextrequest.contextID === context.provider);
                contextRequest.requests = contextRequest.requests.concat(reqDiff.newRequests);
                contextRequest.requests.filter(request => !reqDiff.removedRequests.includes(request));

                await buildImports(AST,contextRequest,context,NEWMEMORYIMPORTS);
            }
        }

        let OLDMEMORYIMPORTS = liveTree.loadMemory(filename).imports.filter(IMPORT => !REMOVED_OR_MODIFIED_IMPORTNAMES.includes(IMPORT.name))

        for(let imp of OLDMEMORYIMPORTS){
            await buildImportFromMemory(AST,imp.varDeclaration);
        }

        liveTree.refreshMemory(filename,OLDMEMORYIMPORTS.concat(NEWMEMORYIMPORTS))

    } else{
        for(let imp of liveTree.loadMemory(filename).imports){
            await buildImportFromMemory(AST,imp.varDeclaration);
        }
    }

    let updatedModule = t.objectProperty(t.stringLiteral(filename),t.callExpression(t.identifier(''),[t.functionExpression(null,[t.identifier('loadExports'),t.identifier('exports'),t.identifier('module')],t.blockStatement(AST.program.body))]));
    //Replace Module in Buffer!! Technically same as HMR.
    liveTree.moduleBuffer.find(value => value.key.value === updatedModule.key.value).value = updatedModule.value;

    let final0 = t.objectExpression(liveTree.moduleBuffer);

    let final1 = generate(t.expressionStatement(t.callExpression(t.identifier(''),[t.callExpression(t.functionExpression(null,[t.identifier('live_modules')],t.blockStatement(liveTree.factory)),[final0])]))).code

    await fs.writeFile(path.dirname(dirToHTML)+'/LIVEPUSH.js',final1);

    return liveTree;

}



interface RequestDiff {
    source:string
    added:boolean
    removed:boolean
    newRequests?:string[]
    removedRequests?:string[]
    namespace:string
}


async function buildImports(ast:t.File,contextRequest:ContextRequest,context:LiveContext,currentMemoryImports:IMPORT[]){
    
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

        let VARDEC = t.variableDeclaration('var',imports)

        ast.program.body.unshift(VARDEC);

        currentMemoryImports.push({name:context.provider,varDeclaration:VARDEC});
    }
}

async function buildImportFromMemory(ast:t.File,IMPORT:t.VariableDeclaration){

    ast.program.body.unshift(IMPORT);

}

async function diffRequests(changes:Change[]): Promise<RequestDiff[]>{

    function defaultErrorReturn(){

    }

    let addedChanges = changes.filter(change => change.added === true).map(change => change.value).join('\n');

    let removedChanges = changes.filter(change => change.removed === true).map(change => change.value).join('\n');

    let ADDED_AST:t.File = await parseAsync(addedChanges,{parserOpts:LooseParseOptions}).catch(err => {
        return {program:{body:[]}};
    });
    let REMOVED_AST:t.File  = await parseAsync(removedChanges,{parserOpts:LooseParseOptions}).catch(err => {
        return {program:{body:[]}};
    });;

    let possibleRequests:RequestDiff[] = []

    //Added Request Diff

    for(let node of ADDED_AST.program.body){
        if(node.type === "ImportDeclaration"){
            possibleRequests.push({source:node.source.value,added:true,removed:undefined,newRequests:node.specifiers.map(specifier => specifier.local.name),namespace:node.specifiers.find(specifier => specifier.type === "ImportDefaultSpecifier").local.name});
        } else if(node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression" 
        && node.expression.left.type === "Identifier" && node.expression.right.type === "CallExpression" 
        && node.expression.right.callee.type === "Identifier" && node.expression.right.callee.name === "require"){
            possibleRequests.push({source:node.expression.right.arguments[0].value,added:true,removed:undefined,newRequests:[node.expression.left.name],namespace:node.expression.left.name})
        }
    }

    //Removed Requests Diff

    for(let node of REMOVED_AST.program.body){
        if(node.type === "ImportDeclaration"){
            let NODE = node;

            if(possibleRequests.findIndex(request => request.source === NODE.source.value) === -1){
                possibleRequests.push({source:node.source.value,added:undefined,removed:true,removedRequests:node.specifiers.map(specifier => specifier.local.name)});
            } else {
                let request = possibleRequests.find(request => request.source === NODE.source.value)
                request.removedRequests = node.specifiers.map(specifier => specifier.local.name);
                request.added = undefined;
            }
        } else if(node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression" 
        && node.expression.left.type === "Identifier" && node.expression.right.type === "CallExpression" 
        && node.expression.right.callee.type === "Identifier" && node.expression.right.callee.name === "require"){

            if(possibleRequests.findIndex(request => request.source === node.expression.right.arguments[0].value) === -1){
                possibleRequests.push({source:node.expression.right.arguments[0].value,added:undefined,removed:true,removedRequests:[node.expression.left.name]});
            }
            else{
                let request = possibleRequests.find(request => request.source === node.expression.right.arguments[0].value)
                request.removedRequests = node.expression.left.name;
                request.added = undefined;
            }
        }
    }


    //Amending ES Requests!!
    for(let diff of possibleRequests){
        if(diff.newRequests && diff.removedRequests){
            let buffer = diff.newRequests;
            diff.newRequests = diff.newRequests.filter(value => !diff.removedRequests.includes(value));
            diff.removedRequests = diff.removedRequests.filter(value => !buffer.includes(value));
        }
    }

    return possibleRequests

}

function removeImportsFromAST(ast:t.File){

    traverse(ast,{
        ImportDeclaration: function(path) {
            path.remove();
        },
        VariableDeclarator: function(path){
            if(path.node.init.type === "CallExpression" && path.node.init.callee.type === "Identifier" && path.node.init.callee.name === "require"){
                path.remove();
            }
        }
    })
}

