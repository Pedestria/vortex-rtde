import * as path from 'path'
import * as resolve from 'resolve'
import * as Babel from '@babel/parser'
import traverse from '@babel/traverse'
import {readFileSync} from 'fs-extra'
import {DefaultQuarkTable, QuarkLibEntry} from './QuarkTable'
import { ParseSettings } from './Options'
import { VortexError, VortexErrorType } from './VortexError'
import {ControlPanel} from './types/ControlPanel'
import {VortexGraph} from './Graph'
import Dependency from './Dependency'
import * as _ from 'lodash'

/**Resolves dependency location based off of Import Location
 * __(To allow Node File System to read/verify imported modules)__
 * 
 * @param {string} rootFileDirToEntry Directory to Current File
 * @param {string} dependencyLocalDir Directory _(according to Current File)_ to Dependency
 * @returns {string} A Resolved Dependency location. 
 */

export function LocalizedResolve(rootFileDirToEntry:string,dependencyLocalDir:string):string{

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

export function resolveLibBundle(nodeLibName:string,ControlPanel:ControlPanel):string{

    let bundleREGEXP = /\.(?:min|prod|slim)/g
    //GraphDepsAndModsForCurrentFile(ResolveLibrary(nodeLibName),Graph)
    let STD_NODE_LIBS = ['path','fs','module','os','fs/promises']

    if(STD_NODE_LIBS.includes(nodeLibName)){
        return 'node.js'
    }

    let bundles = ResolveLibrary(nodeLibName)
    if(bundles instanceof Array)
    {
        if(bundles.length === 1){
            return addJsExtensionIfNecessary(bundles[0])
        }
        for(let bund of bundles){
            if(ControlPanel.isProduction){
                if(bundleREGEXP.test(bund)){
                    return addJsExtensionIfNecessary(bund)
                } 
            }
            else{
                if(!bundleREGEXP.test(bund)){
                    return addJsExtensionIfNecessary(bund)
                }
            }
        }
    }
    else{
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
    }
        // }
}

export function ResolveLibrary(packageName:string){
    let packageIndexDirname = './' + path.relative(path.join(__dirname,'../'),resolve.sync(packageName))

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

    const buffer = readFileSync(packageIndexDirname,'utf-8').toString();

    let regexp = new RegExp('./')

    const jsCode = Babel.parse(buffer,ParseSettings)

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

export function addJsExtensionIfNecessary(file:string){

    if(file.includes('.js') || file.includes('.mjs')){
        return file
    }
    else{
        return file + '.js'
    }
}

export function isJs(filename:string,ControlPanel:ControlPanel){

    if(path.basename(filename) === filename){
        return true
    }
    else if(ControlPanel.extensions.includes(path.extname(filename))){
        return false
    }
    else if(filename.includes('./') || path.extname(filename) === ''){
        return true
    }
    else if(/\.m?jsx?$/g.test(filename)){
        return true
    }
    else if (ControlPanel.InstalledAddons && ControlPanel.InstalledAddons.extensions.js.includes(path.extname(filename))){
        return true
    }
    else if(ControlPanel.InstalledAddons && ControlPanel.InstalledAddons.extensions.other.includes(path.extname(filename))){
        return false;
    }
    else {
        throw new VortexError(`Cannot resolve extension: "${path.extname(filename)}" If you wish to include this in your Solar System, include it in the resolvable extensions option in the vortex.panel.js`,VortexErrorType.PortalPanelError).printOut()
    }

}

export function DependencyCircularCheck(Graph:VortexGraph):Set<string[]>{
    let circularDependencies:Set<string[]> = new Set<string[]>();
    let circdependencyNames:Array<string> = new Array<string>();

    function convertSetToArray <T> (set:Set<T>):Array<T> {
        let newArray:Array<T> = []
        for(let value of set.values()){
            newArray.push(value);
        }
        return newArray
    }

    let dependencyNames = _.uniq([Graph.entryPoint].concat(Graph.Star.map(dep => dep.name),_.flatten(Graph.Planets.map(planet => planet.modules.map(mod => mod.name)))));
    for(let NAME of dependencyNames){
        let TraverseChain:Set<string> = new Set<string>();
        let chain = recursiveGotoandVerify(NAME,Graph.Star.filter(dep => dep.testForImportLocation(NAME)),TraverseChain,circdependencyNames)
        if(chain && chain.has(NAME)){
            circularDependencies.add([NAME].concat(convertSetToArray(chain)));
            circdependencyNames.push(NAME);
        }
    }

    return circularDependencies  

    function recursiveGotoandVerify(name:string,currentDependencies:Dependency[],chain:Set<string>,circDepDict:string[]):Set<string>{
        for(let dep of currentDependencies){
            if(circDepDict.includes(dep.name)){
                return chain
            }
            chain.add(dep.name);
            if(dep.name ===  name){
                return chain
            }else {
                let DEPNAME = dep.name
                let newDependenciesToCheck:Dependency[] = Graph.Star.filter(dep => dep.testForImportLocation(DEPNAME));
                for(let newName of newDependenciesToCheck.map(dep => dep.name)){
                    if(chain.has(newName)){
                        return chain
                    }
                }

                if(newDependenciesToCheck.length === 0){
                    return undefined
                }
                else {
                    return recursiveGotoandVerify(name,newDependenciesToCheck,chain,circDepDict);
                }
            }
        }
        
    }

}
