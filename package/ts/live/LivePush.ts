/*Vortex RTDE
 LivePush 0.6.1
 Copyright Alex Topper 2020 
*/

import * as path from 'path'
import * as fs from 'fs/promises'
import {parseAsync, ParseResult, traverse, NodePath, transformAsync, ParserOptions} from '@babel/core'
import * as t from '@babel/types'
import generate from '@babel/generator'
import * as Parse5 from 'parse5'
import * as resolve from 'resolve'
import { promisify} from 'util'
import {Express,static} from 'express'
import * as ora from 'ora'
import * as chalk from 'chalk'
import * as chokidar from 'chokidar'
import {diffLines, Change} from 'diff'
import {platform} from 'os'
import * as io from 'socket.io'
import * as Panel from '../../vortex.panel'

var tag = "Reload"


import * as _ from 'lodash'
import cliSpinners = require('cli-spinners')
import { Server } from 'http'
import { v4 } from 'uuid'

var resolveAsync =  promisify(resolve)
var diffLinesAsync = promisify(diffLines)

var LooseParseOptions:ParserOptions = {sourceType:"module",allowReturnOutsideFunction:true,allowImportExportEverywhere:true,allowSuperOutsideMethod:true,allowAwaitOutsideFunction:true,allowUndeclaredExports:true}

var loadedModules:string[] = []

var queue:Array<LPEntry> = []

var htmlClientDependenciesAdded:boolean

var globalStylesFile = '/GLOBAL_STYLES.css'

var stylesheets:CodeEntry[] = []


var NON_JS_REGEX = /(\.css|\.ttf|\.png|\.jpe?g)$/g
var fileRegex = /(\.ttf|\.png|\.jpe?g)/g

var INITSTAGE = `
    ============================= 
                            
        Welcome To LivePush!
                        
    =============================
`

var controlPanelDIR:string

var InternalLivePushOptions:{
    externals:{
        libraryName:string
        namespace:string
    }[]
    entry:string
    dirToHTML:string
    fileDirectories:string[]
};

function readControlPanel(ControlPanelObject:typeof Panel):typeof InternalLivePushOptions{

    return {
        externals:ControlPanelObject.livePushOptions.CDNImports,
        entry:ControlPanelObject.livePushOptions.entry,
        dirToHTML:ControlPanelObject.livePushOptions.dirToHTML,
        fileDirectories:ControlPanelObject.livePushOptions.fileDependencyDirs
    }
}


var IO:io.Server

/**
 * 
 * The Vortex Live Updater!
 * 
 */
export class LivePush{

    /**
     * 
     * @param {string} dirToControlPanel Resolved Dir to Vortex Control Panel
     * @param {Express} expressRouter Server router
     * @param {Server} server Node.js Server object (Used for binding socket.io)
     * @param {number} portNum Port num for given node.js server to listen on.
     * @param {boolean} preLoadHTMLPage Option to load from already prepared HTML page.
     */
    constructor(dirToControlPanel:string,expressRouter:Express,server:Server,portNum:number,preLoadHTMLPage:boolean){
        controlPanelDIR = dirToControlPanel;
        const Panel = require(dirToControlPanel);

        InternalLivePushOptions = readControlPanel(Panel);
        //Init Socket.Io
        IO = io(server);

        htmlClientDependenciesAdded = preLoadHTMLPage;

        server.listen(portNum);

        this.run(InternalLivePushOptions.dirToHTML,InternalLivePushOptions.entry,expressRouter);
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

            for(let fileDir of InternalLivePushOptions.fileDirectories){
                router.use(fileDir,static(path.resolve(path.dirname(controlPanelDIR),fileDir)))
            }
            
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

    cssFactory:any

    dirToCssPlanet:string

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
        return this.contexts.find(context => contextID === context.provider)
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
    ast:t.File
}

interface ContextRequest {
    contextID:string
    requests:Array<string>
    namespaceRequest:string
    type:'Module'|'CSS'
}


function isModule(moduleName:string){

    if(NON_JS_REGEX.test(moduleName)){
        return false
    } else if (!path.extname(moduleName)){
        return true
    } else if (/\.m?jsx?$/g.test(moduleName)){
        return true
    }

}

function ResolveRelative(from:string,to:string){
    return './'+path.join(path.dirname(from),to)
}
function addJSExtIfPossible(filename:string){
    let regexp = /\.m?js$/g
    return regexp.test(filename)? filename : filename+'.js'
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
                exports.push(GLOBAL_RESOLVE(DIRNAME(index),addJSExtIfPossible(path.node.right.arguments[0].value)))
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
 * @param {NodePath<t.ImportDeclaration>|NodePath<t.VariableDeclarator>} path
 */

function TreeBuilder(name:string,currentBranch:LiveAddress&LiveBranch|LiveTree,tree:LiveTree,isTree:boolean,path:NodePath<t.ImportDeclaration>|NodePath<t.VariableDeclarator>){

            let module

            if(isModule(name)){
                name = name.includes('./')? addJSExtIfPossible(name) : name
                module = new LiveModule(name);
            } else if(name.includes('.css')) {
                module = new LiveCSS(name);
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
                            context.provider = name
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

            currentBranch.addBranch(module)
        


}

function resolvePathToHTMLPage(resolvedPath:string){
    return PATH.relative(PATH.dirname(InternalLivePushOptions.dirToHTML),PATH.resolve(PATH.dirname(controlPanelDIR),resolvedPath))
}

const PATH = path
/**Traverses Branch and Builds Imports/Requests
 * 
 * @param {LPEntry} entry 
 * @param {LiveBranch&LiveAddress|LiveTree} currentBranch 
 * @param {LiveTree} tree 
 */

function TraverseAndTransform(entry:LPEntry,currentBranch:LiveBranch&LiveAddress|LiveTree,tree?:LiveTree){

    var isTree = false

    if(currentBranch instanceof LiveTree){
        isTree = true
    }
    var defaultExport:t.ExpressionStatement
    var rolledExports:t.ExpressionStatement[] = []

    traverse(entry.ast, {
        // ES6 Imports
        ImportDeclaration: function(path) {
            let name = path.node.source.value.includes('./')? ResolveRelative(entry.name,path.node.source.value) : path.node.source.value
            if(fileRegex.test(name)){
                path.replaceWith(t.variableDeclaration("var",[t.variableDeclarator(t.identifier(path.node.specifiers[0].local.name),t.stringLiteral(resolvePathToHTMLPage(name)))]));
                return;
            }else{
                TreeBuilder(name,currentBranch,tree,isTree,path);
                path.remove();
            }
        },
        //CommonJS Requires!
        VariableDeclarator: function(path){
            if(path.node.init !== null && path.node.init.type === 'CallExpression' && path.node.init.callee.type === 'Identifier' && path.node.init.callee.name === 'require'){
                let name = path.node.init.arguments[0].value.includes('./') && entry.name.includes('./')? ResolveRelative(entry.name,path.node.init.arguments[0].value) : path.node.init.arguments[0].value
                TreeBuilder(name,currentBranch,tree,isTree,path)
                path.remove();
                // Interop Require Wildcard!!
            } else if(path.node.init !== null && path.node.init.type === "CallExpression" && path.node.init.callee.type === "Identifier" 
            && path.node.init.callee.name.includes("_interop") && path.node.init.arguments[0].type === "CallExpression" 
            && path.node.init.arguments[0].callee.type === "Identifier" && path.node.init.arguments[0].callee.name === "require") {
                let name = path.node.init.arguments[0].arguments[0].value.includes('./') && entry.name.includes('./')? ResolveRelative(entry.name,path.node.init.arguments[0].arguments[0].value) : path.node.init.arguments[0].arguments[0].value
                TreeBuilder(name,currentBranch,tree,isTree,path);
                path.remove();
            }
        },
        //Envify Modules!
        MemberExpression: function(path){
            if(path.node.object.type === 'MemberExpression' && path.node.object.object.type === 'Identifier' && path.node.object.object.name === 'process' 
            && path.node.object.property.name === 'env' && path.node.property.name === 'NODE_ENV'){
                path.replaceWith(t.stringLiteral('live'));
            }
        },
        ExportNamedDeclaration: function(path){
            if(path.node.specifiers.length > 0){
                for(let specifier of path.node.specifiers){
                    if(specifier.type === "ExportSpecifier"){
                        rolledExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("exports"),t.identifier(specifier.exported)),t.identifier(specifier.local))));
                    }
                }
                path.remove();
            }  
            else {
                if(path.node.declaration.type === "ClassDeclaration"){
                    rolledExports.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("exports"),t.identifier(path.node.declaration.id.name)),t.identifier(path.node.declaration.id.name))))
                    path.replaceWith(path.node.declaration)
                } else if(path.node.declaration.type === "FunctionDeclaration"){
                    path.replaceWith(t.assignmentExpression("=",t.memberExpression(t.identifier("exports"),t.identifier(path.node.declaration.id.name)),
                    t.functionExpression(path.node.declaration.id,path.node.declaration.params,path.node.declaration.body,path.node.declaration.generator,path.node.declaration.async)))
                }
            }
        },
        ExportDefaultDeclaration: function(path){
            defaultExport = t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("module"),t.identifier("exports")),t.identifier(path.node.declaration.id.name)));
            path.replaceWith(path.node.declaration)
        }
    })

    entry.ast.program.body = entry.ast.program.body.concat(rolledExports);
    if(defaultExport){
        entry.ast.program.body.push(defaultExport);
    }

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
    return queue.find(entry => entry.name === entry_name);
}

/**
 * Recursivly fetches Live Branch from tree!
 * @param {string} addressID 
 * @param {LiveTree|LiveModule} tree_OR_branch 
 */

function fetchAddressFromTree(addressID:string,tree_OR_branch:LiveTree|LiveModule):LiveTree|LiveModule{
    if(tree_OR_branch.ID === addressID){
        return tree_OR_branch
    }
    else {
        for(let branch of tree_OR_branch.branches){
            if(branch instanceof LiveModule){
                if(branch.ID === addressID){
                    return branch
                }else {
                    var subBranch = fetchAddressFromTree(addressID,branch);
                    if(subBranch){
                        return subBranch
                    }
                }
            }
        }

        // for(let branch of tree_OR_branch.branches){
        //     if(branch instanceof LiveModule){
        //         return fetchAddressFromTree(addressID,branch);
        //     }
        // }

    }
}

function loadRequestFromAddress(address:LiveAddress,context_ID:string){
    return address.requests.find(request => request.contextID === context_ID)
}

function normalizeModuleName(name:string){
    if(name[0] === '@'){
        name = name.slice(1);
    }
    let NASTY_CHARS = /(@|\/|\^|\$|#|\*|&|!|%|-|\.|\\)/g
    return name.replace(NASTY_CHARS,"_");
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
        
            return `./${shortEntry.replace(/\//g,"\\")}`
        }
    }
    function amendEntryPoint2(entry:string){
        if(platform() !== "win32"){
            return entry
        } else {
            let shortEntry = entry.slice(2)
            return `./${shortEntry.replace(/\//g,"\\\\")}`
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
        } else if (context instanceof CSSContext) {
            stylesheets.push({name:context.provider,code:(await fs.readFile(context.provider)).toString()});
        }
    }

    var STYLENAME = `${path.dirname(dirToHtml)}${globalStylesFile}`

    let factory:string = `
    var loadedModules = [];
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

    ${stylesheets.length > 0? ` 
    var cssPlanet = document.createElement("link");
    cssPlanet.rel = "stylesheet";
    cssPlanet.href = "${'.'+globalStylesFile}";
    document.head.appendChild(cssPlanet);
    ` : ''}
  
    return loadExports('${platform() === "win32"? ROOT2 : ROOT}');`

    let styleFactory = `
    var loadedModules = [];
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
    var cssPlanet = document.createElement("link");
    cssPlanet.rel = "stylesheet";
    cssPlanet.href = "${'.'+globalStylesFile}";
    document.head.appendChild(cssPlanet);
  
    return loadExports('${platform() === "win32"? ROOT2 : ROOT}')`

    if(stylesheets.length > 0){
        await fs.writeFile(STYLENAME,stylesheets.map(entry => entry.code).join('\n'));
        liveTree.dirToCssPlanet = STYLENAME;
    }

    let parsedFactory =  (await parseAsync(factory,{sourceType:'module',parserOpts:{allowReturnOutsideFunction:true}})).program.body
    let parsedCSSFactory = (await parseAsync(styleFactory,{sourceType:'module',parserOpts:{allowReturnOutsideFunction:true}})).program.body

    liveTree.factory = parsedFactory;
    liveTree.cssFactory = parsedCSSFactory;

    
    let buffer:t.ObjectProperty[] = []

    for(let ent of queue){
        buffer.push(t.objectProperty(t.stringLiteral(ent.name),t.callExpression(t.identifier(''),[t.functionExpression(null,[t.identifier('loadExports'),t.identifier('exports'),t.identifier('module')],t.blockStatement(ent.ast.program.body))])))
    }

    liveTree.moduleBuffer = buffer

    let final0 = t.objectExpression(buffer);

    let final1 = generate(t.expressionStatement(t.callExpression(t.identifier(''),[t.callExpression(t.functionExpression(null,[t.identifier('live_modules')],t.blockStatement(parsedFactory)),[final0])])))
    if(!htmlClientDependenciesAdded){
        await appendToHTMLPage(dirToHtml,final1.code);
    }
    else{
        await fs.writeFile(path.dirname(dirToHtml)+'/LIVEPUSH.js',final1.code);
    }

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

var CSSREGEX = /\.css$/

async function initWatch(Tree:LiveTree,router:Express,htmlDir:string){

    var reloadcount:number = 0;

    reloadHTML(true,tag+"0");

    const watcher = ora({prefixText:'Watching Files...',spinner:cliSpinners.circleHalves})

    var TREE = Tree

    const pushStage = ora({prefixText:chalk.yellowBright('Pushing...'),spinner:cliSpinners.bouncingBar});

    // Modules to Watch (Includes Entry Point!)
    var modulesAndStylesToWatch = loadedModules.filter(filename => filename.includes('./')).concat(stylesheets.map(entry => entry.name));

    var Watcher = new chokidar.FSWatcher({persistent:true})

    TREE.preProcessQueue = TREE.preProcessQueue.filter(entry => entry.name.includes('./'));

    Watcher.add(modulesAndStylesToWatch);

    watcher.start();

    Watcher.on("change",(filename) => {
        filename = './'+filename
        // console.log(`${filename} has been Changed!`)
        watcher.stop();
        pushStage.start();

        console.log(filename);

        if(CSSREGEX.test(filename)){
            updateCSS(filename,TREE.dirToCssPlanet).then(() => {
                pushStage.succeed();
                console.log(chalk.redBright('Successfully Pushed CSS Changes!'));
                reloadcount += 1
                reloadHTML(false,tag+reloadcount);
                watcher.start();
            }).catch(err => console.log(err));
        } else if(isModule(filename)){

            updateTree(filename,TREE,TREE.preProcessQueue,htmlDir).then(({liveTree,delta}) => {
                TREE = liveTree;

                if(delta.length > 0){
                    let newModulesToWatch = delta.filter(filename => filename.includes('./'));

                    if(newModulesToWatch.length > 0){
                        Watcher.add(newModulesToWatch);
                        console.log('Watching new modules:'+newModulesToWatch.join(','));
                    }

                    console.log('New modules added to project:'+delta.join(','))
                }
                pushStage.succeed();
                console.log(chalk.greenBright("Successfully Pushed Changes!"));
                reloadcount += 1
                reloadHTML(false,tag+reloadcount);
                watcher.start();
            }).catch(err => {
                console.log(err);
            });
        }
    })

}


async function updateTree(filename:string,liveTree:LiveTree,preProcessQueue:Array<CodeEntry>,dirToHTML:string) {

    console.log("Hello");

    let priorloadedStyles:string[] = new Array<string>(...stylesheets.map(entry => entry.name))

    let priorLoadedModules:string[] = new Array<string>(...loadedModules);
    
    let newFile = (await transformAsync((await fs.readFile(filename)).toString(),{sourceType:'module',presets:['@babel/preset-react'],plugins:['@babel/plugin-proposal-class-properties']})).code;

    let oldTrans = preProcessQueue.find(entry => entry.name === filename).code

    var CHANGES:Array<Change> = await diffLinesAsync(await processJSForRequests(oldTrans),await processJSForRequests(newFile));

    var REQUESTDIFF = await diffRequests(CHANGES,filename);

    preProcessQueue.find(entry => entry.name === filename).code = newFile;

    let AST:t.File = await parseAsync(newFile,{sourceType:'module',parserOpts:{strictMode:false}});

    removeImportsAndExportsFromAST(AST,filename);

    fetchLPEntry(filename).ast = AST;

    var delta:string[] = [];

    if(REQUESTDIFF.length > 0){

        let REMOVED_OR_MODIFIED_IMPORTNAMES:string[] = [];

        let NEWMEMORYIMPORTS:IMPORT[] = []

        for(let reqDiff of REQUESTDIFF){
            //Import has been added!
            if(reqDiff.added){
                if(liveTree.contextExists(reqDiff.resolvedSource)){
                    //If Css is added already, continue!!!
                    if(CSSREGEX.test(reqDiff.source)){
                        let context:CSSContext = liveTree.loadContext(reqDiff.resolvedSource);
                        context.addresses.push(filename);
                        continue;
                    }
                    let context = liveTree.loadContext(reqDiff.resolvedSource)
                    let module = fetchAddressFromTree(filename,liveTree)
                    let cntRqt:ContextRequest = {contextID:context.provider,requests:reqDiff.newRequests,type:'Module',namespaceRequest:reqDiff.namespace};
                    context.addAddress(module);
                    module.requests.push(cntRqt);
                    
                    await buildImports(AST,cntRqt,context,NEWMEMORYIMPORTS);

                } else {
                    let NAME = reqDiff.source.includes('./')? ResolveRelative(filename,reqDiff.source) : reqDiff.source;

                    let newModule;

                    if(isModule(NAME)){
                        newModule = new LiveModule(NAME);
                    }else{
                        //If new Css module is added to system, continue!!!
                        if(CSSREGEX.test(NAME)){
                            let cssContext = new CSSContext();
                            cssContext.provider = reqDiff.resolvedSource;
                            cssContext.addresses.push(filename);
                            liveTree.contexts.push(cssContext);

                            if(liveTree.factory !== liveTree.cssFactory){
                                liveTree.factory = liveTree.cssFactory;
                            }

                            delta.push(NAME);

                            stylesheets.push({name:NAME,code:(await fs.readFile(NAME)).toString()});
                            continue;
                        }
                    }

                    fetchAddressFromTree(filename,liveTree).addBranch(newModule)

                    if(newModule instanceof LiveModule){
                        if(NAME.includes('./')){
                            let trans = (await transformAsync((await fs.readFile(NAME)).toString(),{sourceType:'module',presets:['@babel/preset-react'],plugins:['@babel/plugin-proposal-class-properties']})).code

                            liveTree.preProcessQueue.push({name:NAME,code:trans});

                            let ENTRY:LPEntry = {name:NAME,ast:await parseAsync(trans,{sourceType:'module'})}
                            queue.push(ENTRY)

                            TraverseAndTransform(ENTRY,newModule,liveTree);

                            if(newModule.branches.length > 0){
                                await RecursiveTraverse(newModule,liveTree,queue);
                            }
                        } else{
                            let libloc = await resolveNodeLibrary(NAME);
                            newModule.libLoc = libloc;
                            let ENTRY:LPEntry = {name:NAME,ast:await parseAsync((await fs.readFile(libloc)).toString(),{sourceType:'module'})}
                            queue.push(ENTRY)

                            TraverseAndTransform(ENTRY,newModule,liveTree);

                            if(newModule.branches.length > 0){
                                await RecursiveTraverse(newModule,liveTree,queue)
                            }
                        
                        }

                        loadedModules.push(NAME)

                    }

                    let context = new ModuleContext();

                    context.provider = NAME;

                    let module = fetchAddressFromTree(filename,liveTree);
                    context.addAddress(module);
                    let cntRqt:ContextRequest = {contextID:context.provider,requests:reqDiff.newRequests,type:'Module',namespaceRequest:reqDiff.namespace};
                    module.requests.push(cntRqt)
                    liveTree.contexts.push(context);

                    await buildImports(AST,cntRqt,context,NEWMEMORYIMPORTS);
                }
                //Import has been removed!
            } else if(reqDiff.removed){
                if(CSSREGEX.test(reqDiff.source)){
                    let cssContext:CSSContext = liveTree.loadContext(reqDiff.resolvedSource);
                    cssContext.removeAddress(filename);
                    if(cssContext.addresses.length === 0){
                        liveTree.removeContext(reqDiff.resolvedSource);
                        stylesheets.filter(entry => entry.name !== reqDiff.resolvedSource);
                    } 
                    continue;
                }

                REMOVED_OR_MODIFIED_IMPORTNAMES.push(reqDiff.source);
                let context = liveTree.loadContext(reqDiff.resolvedSource);
                let module:LiveModule = fetchAddressFromTree(filename,liveTree);
                context.removeAddress(module.main);
                module.requests.filter(contextrequest => contextrequest.contextID !== context.provider);

                if(context.addresses.length === 0){
                    liveTree.removeContext(context.provider);
                }
                //Import requests have been modified!
            } else {
                REMOVED_OR_MODIFIED_IMPORTNAMES.push(reqDiff.source);
                let context = liveTree.loadContext(reqDiff.resolvedSource);
                let contextRequest = fetchAddressFromTree(filename,liveTree).requests.find(contextrequest => contextrequest.contextID === context.provider);
                contextRequest.requests = contextRequest.requests.concat(reqDiff.newRequests);
                contextRequest.requests = contextRequest.requests.filter(request => !reqDiff.removedRequests.includes(request));

                await buildImports(AST,contextRequest,context,NEWMEMORYIMPORTS);
            }
        }

        let OLDMEMORYIMPORTS = liveTree.loadMemory(filename).imports.filter(IMPORT => !REMOVED_OR_MODIFIED_IMPORTNAMES.includes(IMPORT.name));

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

    //If new modules were added on push!!
    if(loadedModules.length > priorLoadedModules.length){
        let newloadedModules = loadedModules.filter(module => !priorLoadedModules.includes(module));

        delta = newloadedModules;
        
        for(let module of newloadedModules){
            let Entry = fetchLPEntry(module)
            for(let request of fetchAddressFromTree(module,liveTree).requests){
                await buildImportsFromNewModule(Entry,request,liveTree.loadContext(request.contextID),liveTree);
            }

            let newModule = t.objectProperty(t.stringLiteral(module),t.callExpression(t.identifier(''),[t.functionExpression(null,[t.identifier('loadExports'),t.identifier('exports'),t.identifier('module')],t.blockStatement(Entry.ast.program.body))]));

            liveTree.moduleBuffer.push(newModule);
        }
    }

    if(priorloadedStyles.length < stylesheets.map(entry => entry.name).length){
        let cssPlanetloc = path.dirname(dirToHTML)+globalStylesFile;
        await fs.writeFile(cssPlanetloc,stylesheets.map(entry => entry.code).join('\n'));
        if(!liveTree.dirToCssPlanet){
            liveTree.dirToCssPlanet = cssPlanetloc;
        }
    }

    let final0 = t.objectExpression(liveTree.moduleBuffer);

    let final1 = generate(t.expressionStatement(t.callExpression(t.identifier(''),[t.callExpression(t.functionExpression(null,[t.identifier('live_modules')],t.blockStatement(liveTree.factory)),[final0])]))).code

    await fs.writeFile(path.dirname(dirToHTML)+'/LIVEPUSH.js',final1);

    return {liveTree,delta};

}

/**
 * Request Diff Object
 */
 
interface RequestDiff {
    /**
     * File location.
     */
    source:string
    /**
     * Resolved file location
     */
    resolvedSource:string
    added:boolean
    removed:boolean
    newRequests?:string[]|["NONE"]
    removedRequests?:string[]|["NONE"]
    namespace?:string
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

        if(contextRequest.requests[0] !== "NONE"){
            for(let request of contextRequest.requests){
                imports.push(t.variableDeclarator(t.identifier(request),t.memberExpression(t.identifier(newName),t.identifier(request))))
            }
        }

        let VARDEC = t.variableDeclaration('var',imports)

        ast.program.body.unshift(VARDEC);

        currentMemoryImports.push({name:context.provider,varDeclaration:VARDEC});
    }
}

async function buildImportsFromNewModule(Entry:LPEntry,contextRequest:ContextRequest,context:LiveContext,liveTree:LiveTree){

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
        if(contextRequest.requests[0] !== "NONE"){
            for(let request of contextRequest.requests){
                imports.push(t.variableDeclarator(t.identifier(request),t.memberExpression(t.identifier(newName),t.identifier(request))))
            }
        }

        let VARDEC = t.variableDeclaration('var',imports)

        Entry.ast.program.body.unshift(VARDEC);

        if(liveTree.memoryExists(Entry.name)){
            liveTree.addImportToMemory(Entry.name,VARDEC,context.provider);
        }
        else {
            liveTree.addMemory({address:Entry.name,imports:[{varDeclaration:VARDEC,name:context.provider}]});
        }

    }
}

async function buildImportFromMemory(ast:t.File,IMPORT:t.VariableDeclaration){

    ast.program.body.unshift(IMPORT);

}

async function diffRequests(changes:Change[],filename:string): Promise<RequestDiff[]>{

    if(changes.length === 0){
        return [];
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
            if(node.specifiers.length > 0){
                possibleRequests.push({source:node.source.value,resolvedSource:node.source.value.includes('./')? ResolveRelative(filename,node.source.value) : node.source.value,
                added:true,removed:undefined,newRequests:node.specifiers.map(specifier => specifier.local.name),
                    namespace:node.specifiers.find(specifier => specifier.type === "ImportDefaultSpecifier")? node.specifiers.find(specifier => specifier.type === "ImportDefaultSpecifier").local.name : undefined});
            } else {
                possibleRequests.push({source:node.source.value,added:true,removed:undefined,newRequests:["NONE"],resolvedSource:node.source.value.includes('./')? ResolveRelative(filename,node.source.value) : node.source.value});
            }
        } else if(node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression" 
        && node.expression.left.type === "Identifier" && node.expression.right.type === "CallExpression" 
        && node.expression.right.callee.type === "Identifier" && node.expression.right.callee.name === "require"){
            possibleRequests.push({source:node.expression.right.arguments[0].value,
                resolvedSource:node.expression.right.arguments[0].value.includes('./')? ResolveRelative(filename,node.expression.right.arguments[0].value) : node.expression.right.arguments[0].value,added:true,removed:undefined,
                newRequests:[node.expression.left.name],namespace:node.expression.left.name})
        }
    }

    //Removed Requests Diff

    for(let node of REMOVED_AST.program.body){
        if(node.type === "ImportDeclaration"){
            let NODE = node;

            if(node.specifiers.length > 0){
                if(possibleRequests.findIndex(request => request.source === NODE.source.value) === -1){
                    possibleRequests.push({source:node.source.value,added:undefined,removed:true,removedRequests:node.specifiers.map(specifier => specifier.local.name),resolvedSource:node.source.value.includes('./')? ResolveRelative(filename,node.source.value) : node.source.value});
                } else {
                    let request = possibleRequests.find(request => request.source === NODE.source.value)
                    request.removedRequests = node.specifiers.map(specifier => specifier.local.name);
                    request.added = undefined;
                }
            } else {
                possibleRequests.push({source:node.source.value,added:undefined,removed:true,removedRequests:["NONE"],resolvedSource:node.source.value.includes('./')? ResolveRelative(filename,node.source.value) : node.source.value});
            }
        } else if(node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression" 
        && node.expression.left.type === "Identifier" && node.expression.right.type === "CallExpression" 
        && node.expression.right.callee.type === "Identifier" && node.expression.right.callee.name === "require"){

            if(possibleRequests.findIndex(request => request.source === node.expression.right.arguments[0].value) === -1){
                possibleRequests.push({source:node.expression.right.arguments[0].value,added:undefined,removed:true,removedRequests:[node.expression.left.name],
                    resolvedSource:node.expression.right.arguments[0].value.includes('./')? ResolveRelative(filename,node.expression.right.arguments[0].value) : node.expression.right.arguments[0].value});
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
            let buffer = new Array<string>(...diff.newRequests);
            diff.newRequests = diff.newRequests.filter(value => !diff.removedRequests.includes(value));
            diff.removedRequests = diff.removedRequests.filter(value => !buffer.includes(value));
        }
    }
    //Removes File Dependency diffs
    return possibleRequests.filter(requestdiff => !fileRegex.test(requestdiff.source))

}

function removeImportsAndExportsFromAST(ast:t.File,currentFile:string){

    let exportsToBeRolled:t.ExpressionStatement[] = []
    let defaultExport:t.ExpressionStatement

    traverse(ast,{
        ImportDeclaration: function(path) {
            if(fileRegex.test(path.node.source.value)){
                path.replaceWith(t.variableDeclaration("var",[t.variableDeclarator(t.identifier(path.node.specifiers[0].local.name),t.stringLiteral(resolvePathToHTMLPage(ResolveRelative(currentFile,path.node.source.value))))]))
            }
            else {
                path.remove();
            }
        },
        VariableDeclarator: function(path){
            if(path.node.init.type === "CallExpression" && path.node.init.callee.type === "Identifier" && path.node.init.callee.name === "require"){
                path.remove();
            }
        }, 
        ExportNamedDeclaration: function(path){
            if(path.node.specifiers.length > 0){
                for(let specifier of path.node.specifiers){
                    if(specifier.type === "ExportSpecifier"){
                        exportsToBeRolled.push(t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("exports"),t.identifier(specifier.exported.name)),t.identifier(specifier.local.name))));
                    }
                }
                path.remove();
            }
            else {
                if(path.node.declaration.type === "ClassDeclaration"){
                    path.replaceWith(t.assignmentExpression("=",t.memberExpression(t.identifier("exports"),t.identifier(path.node.declaration.id.name)),path.node.declaration))
                } else if(path.node.declaration.type === "FunctionDeclaration"){
                    path.replaceWith(t.assignmentExpression("=",t.memberExpression(t.identifier("exports"),t.identifier(path.node.declaration.id.name)),
                    t.functionExpression(path.node.declaration.id,path.node.declaration.params,path.node.declaration.body,path.node.declaration.generator,path.node.declaration.async)))
                }
            }
        },
        ExportDefaultDeclaration: function(path){
            defaultExport = t.expressionStatement(t.assignmentExpression("=",t.memberExpression(t.identifier("module"),t.identifier("exports")),t.identifier(path.node.declaration.id.name)));
            path.replaceWith(path.node.declaration)
        }
    })

    ast.program.body = ast.program.body.concat(exportsToBeRolled)
    if(defaultExport){
        ast.program.body.push(defaultExport)
    }
}

async function processJSForRequests(code:string){

    let commentregex:RegExp = /(\/\/.*)|(\/\*(.|\n)*\*\/)/g
    let requestregex:RegExp = /(import ((['|"][\w\/.]+['|"])|( *{[\w\W,]+} from ['|"][\w\/.]+['|"])|(\w+ *[, ] *(?:(?<=,)( *{[\w, ]+} from ['|"][\w\/.]+['|"])|(?<!,)(from ['|"][\w\/.]+['|"]))|(from ['|"]\w+['|"])))|((const|var|let)( +[\w$!]+ *= *require\(['|"][\w\/.]+['|"]\))))/g

    let newCode = code.replace(commentregex,"");

    let matches = newCode.match(requestregex);

    return matches === null? "" : matches.join("\n");
    
}

async function updateCSS(filename:string,cssPlanetLocation:string){

    let newCSS = (await fs.readFile(filename)).toString();
    stylesheets.find(entry => entry.name === filename).code = newCSS;
    await fs.writeFile(cssPlanetLocation,stylesheets.map(entry => entry.code).join('\n'));

    return;
}

function reloadHTML(initStage:boolean,tag:string){
    IO.emit("LP_RELOAD",tag);
}


