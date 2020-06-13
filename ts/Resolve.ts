import path = require('path')
import resolve = require('resolve')
import * as Babel from '@babel/parser'
import traverse from '@babel/traverse'
import * as fs from 'fs-extra'
import {DefaultQuarkTable, QuarkLibEntry} from './QuarkTable'

export function LocalizedResolve(rootFileDirToEntry:string,dependencyLocalDir:string){

    if(rootFileDirToEntry == dependencyLocalDir){
        return rootFileDirToEntry
    }
    else if(path.dirname(dependencyLocalDir) == './'){
        return dependencyLocalDir
    }

    let dirname = path.dirname(rootFileDirToEntry)
    let localFilePath = dependencyLocalDir

    return './' + path.join(dirname,localFilePath)

}

export function ResolveLibrary(packageName:string){
    let packageIndexDirname = fixLibraryPath(resolve.sync(packageName))

    let testOutput = []

    if(DefaultQuarkTable.findEntryByName(packageName) !== null){
        return DefaultQuarkTable.QuarkLibs[DefaultQuarkTable.findEntryByName(packageName)].bundleLocs
    }

    if  (LibraryRelayVerify(packageIndexDirname).length == 0){
        return packageIndexDirname
    }

    for(let bundle of LibraryRelayVerify(packageIndexDirname)){
        testOutput.push(LocalizedResolve(packageIndexDirname,bundle))
    }

    return testOutput

}

function LibraryRelayVerify(packageIndexDirname:string){

    const buffer = fs.readFileSync(packageIndexDirname,'utf-8').toString();

    let regexp = new RegExp('./')

    const jsCode = Babel.parse(buffer,{"sourceType":"module"})

    let libBundles:Array<string> = []


    traverse(jsCode,
        {enter(path) {
            if(path.node.type === 'ExpressionStatement'){
            if (path.node.expression.type === 'AssignmentExpression') {
                if(path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression'){
                    if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){
                        if(path.node.expression.right.callee.name === 'require') {
                            //libBundles.push(LocalizedResolve(packageIndexDirname,path.path.node.expression.right.arguments[0].value))
                            libBundles.push(path.node.expression.right.arguments[0].value)

                            }
                        }
                    }
                }
            }
        }
    });
    return libBundles
}

function fixLibraryPath(pathToFile:string){
    if(pathToFile.search('node_modules') == -1){
        throw new Error('Package Does not Exist!')
    }
    else{
        let i = pathToFile.search('node_modules')
        return './' + pathToFile.slice(i)
    }
}

function isQuarky(entryPoint:string){

    const buffer = fs.readFileSync(entryPoint,'utf-8').toString();

    let regexp = new RegExp('./')

    const jsCode = Babel.parse(buffer,{"sourceType":"module"})

    traverse(jsCode,{
        enter(path){

            if (path.node.type === 'VariableDeclaration') {
                if (path.node.declarations[0].init !== null){
                    if (path.node.declarations[0].init.type === 'CallExpression') {
                        if(path.node.declarations[0].init.callee.name === 'require') {
                            if(path.node.declarations[0].id.type === 'ObjectPattern'){
                                for (let namedRequires of path.node.declarations[0].id.properties){
                                    //console.log(namedRequires.value)
                                    if(testForLocalFileRequires(LocalizedResolve(entryPoint,namedRequires.value))){
                                        return true
                                    }
                                }
                            }
                            else{
                                if(testForLocalFileRequires(LocalizedResolve(entryPoint,path.node.declarations[0].init.arguments[0].value))){
                                    return true
                                }
                            }
                        }
                    }
                }
            }

            if (path.node.type === 'ExpressionStatement') {
                if (path.node.expression.type === 'AssignmentExpression') {
                    if(path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression'){
                        if(path.node.expression.right.callee.name === 'require') {
                            if(testForLocalFileRequires(LocalizedResolve(entryPoint,path.node.expression.right.arguments[0].value))){
                                return true
                            }
                        }
                    }
                }
                if(path.node.expression.type === 'CallExpression'){
                    if(path.node.expression.callee.type === 'CallExpression'){
                        if (path.node.expression.callee.callee.name === 'require'){
                            if(testForLocalFileRequires(LocalizedResolve(entryPoint,path.node.expression.callee.arguments[0].value))){
                                return true
                            }
                        }
                    }
                }
            }

        }
    })
    return false
}

function testForLocalFileRequires(filename:string){

    console.log(filename)

    const buffer = fs.readFileSync(addJsExtensionIfNecessary(filename),'utf-8').toString();

    let regexp = new RegExp('./')

    const jsCode = Babel.parse(buffer,{"sourceType":"module"})


    traverse(jsCode,{
        enter(path){

            if (path.node.type === 'VariableDeclaration') {
                //console.log(path.node)
                let modules = []
                if (path.node.declarations[0].init.type === 'CallExpression') {
                    if(path.node.declarations[0].init.callee.name === 'require') {
                        if(path.node.declarations[0].id.type === 'ObjectPattern'){
                            for (let namedRequires of path.node.declarations[0].id.properties){
                                if(namedRequires.value.match(regexp) !== null){
                                    return true
                                }
                            }
                        }
                        else{
                            if(path.node.declarations[0].init.arguments[0].value.match(regexp) !== null){
                                return true
                            }
                        }
                    }
                }
            }

            if (path.node.type === 'ExpressionStatement') {
                if (path.node.expression.type === 'AssignmentExpression') {
                    if(path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression'){
                        if(path.node.expression.right.callee.name === 'require') {
                            if(path.node.expression.right.arguments[0].value.match(regexp) !== null){
                                return true
                            }
                        }
                    }
                }
                if(path.node.expression.type === 'CallExpression'){
                    if(path.node.expression.callee.type === 'CallExpression'){
                        if (path.node.expression.callee.callee.name === 'require'){
                            if(path.node.expression.callee.arguments[0].value.match(regexp) !== null){
                                return true
                            }
                        }
                    }
                }
            }

        }
    })
    return false
}

export function addJsExtensionIfNecessary(file:string){

    let jsExt = new RegExp('.js')
    if(file.match(jsExt) !== null){
        return file
    }
    else{
        return file + '.js'
    }
}
