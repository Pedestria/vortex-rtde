import * as path from 'path'
import * as resolve from 'resolve'
import * as Babel from '@babel/parser'
import traverse from '@babel/traverse'
import * as fs from 'fs-extra'
import {DefaultQuarkTable, QuarkLibEntry} from './QuarkTable'
import {isProduction} from './Options'
import * as chalk from 'chalk'

/**Resolves dependency location based off of Import Location
 * __(To allow Node File System to read/verify imported modules)__
 * 
 * @param {string} rootFileDirToEntry Directory to Current File
 * @param {string} dependencyLocalDir Directory _(according to Current File)_ to Dependency
 * @returns {string} A Resolved Dependency location. 
 */

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

/**Resolves a Node Module
 * 
 * @param {string} nodeLibName Name of Node Module to Resolve 
 * @returns {string} A Locally Resolved library bundle location __(Depending on global config, will return either minified or development bundle. If a minified bundle does NOT exist, a cache directory will be made and the bundle will be minfied using _Terser_ )__
 */

export function resolveLibBundle(nodeLibName:string){
    //GraphDepsAndModsForCurrentFile(ResolveLibrary(nodeLibName),Graph)
    let minified = new RegExp('min')
    let STD_NODE_LIBS = ['path','fs','module']

    if(STD_NODE_LIBS.includes(nodeLibName)){
        return 'node.js'
    }

    let bundles = ResolveLibrary(nodeLibName)
    if(bundles instanceof Array)
    {
        for(let lib of bundles){
            if (lib.match(minified) && isProduction){
                return lib
            }
            else if(lib.match(minified) == null && isProduction == false){
                return lib
            }
        }
    }
    // else{
        // if(isProduction){
        //     let fileName = path.basename(bundles,'.js')
        //     let finalPath = './cache/libs/' + fileName + '.min.js'
        //     if(fs.existsSync(finalPath)){
        //         return finalPath
        //     }
        //     let fileToBeMinified = fs.readFileSync(bundles).toString()
        //     let min = terser.minify(fileToBeMinified)
        //     fs.writeFileSync(finalPath,min.code)
        //     return finalPath
        // }
        // else{
            return bundles
        // }
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
    if(pathToFile.includes('node_modules') == false){
        throw new Error(chalk.redBright('Package "' + pathToFile + '" does not Exist!'))
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
