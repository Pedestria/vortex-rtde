/*Vortex RTDE
 LivePush 0.0.0
 Copyright Alex Topper 2020 
*/

import * as path from 'path'
import * as fs from 'fs/promises'
import {parseAsync, ParseResult, traverse} from '@babel/core'
import * as t from '@babel/types'
import { PassThrough } from 'stream'
import generate from '@babel/generator'
import e = require('express')

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
        initLiveDependencyTree(dirToEntry).catch(err => console.log(err))
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
    return filename.includes('.js')||filename.includes('.mjs')? filename : filename+'.js'
}
function resolveNodeLibrary(){



}

function TraverseAndTransform(entry:LPEntry,currentBranch:LiveBranch&LiveAddress|LiveTree,tree?:LiveTree){

    var isTree = false

    if(currentBranch instanceof LiveTree){
        isTree = true
    }

    traverse(entry.ast, {
        ImportDeclaration: function(path) {
            let name = path.node.source.value.includes('./')? ResolveRelative(entry.name,path.node.source.value) : path.node.source.value
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
                    if(!context.addressExists){
                        context.addAddress(currentBranch)
                    }

                    currentBranch.requests.push({contextID:context.provider,requests:path.node.specifiers.map(imp => imp.local.name)})
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

                        currentBranch.requests.push({contextID:context.provider,requests:path.node.specifiers.map(imp => imp.local.name)})
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
                    currentBranch.requests.push({contextID:context.provider,requests:path.node.specifiers.map(imp => imp.local.name)})
                }   
            }

            if(!module){
                currentBranch.fileBin.push(file)
            }
            else {
                currentBranch.addBranch(module)
            }

            path.remove()
        }
    })

}


async function initLiveDependencyTree(root:string){


    var queue:Array<LPEntry> = []
    var loadedModules:Array<string> = []
    
    var liveTree = new LiveTree();
    liveTree.root = root
    liveTree.ID = root

    var rootEntry:LPEntry = {name:root,ast:await parseAsync((await fs.readFile(root)).toString(),{sourceType:"module",presets:['@babel/preset-react']},)}
    queue.push(rootEntry)
    loadedModules.push(root)

    TraverseAndTransform(rootEntry,liveTree)

    for(let branch of liveTree.branches){
        if(branch instanceof LiveModule){
            if(!loadedModules.includes(branch.main)) {
                if(branch.main.includes('./')){
                    let ENTRY:LPEntry = {name:branch.main,ast:await parseAsync((await fs.readFile(branch.main)).toString(),{sourceType:"module",presets:['@babel/preset-react']},)}
                    queue.push(ENTRY)
                    TraverseAndTransform(ENTRY,branch,liveTree)
                    loadedModules.push(branch.main)
                }
            }
        }
    }

    console.log(liveTree.contexts)

}
