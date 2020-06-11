import * as fs from 'fs-extra'
import * as path from 'path'
import * as Babel from '@babel/parser'
import * as BabelGenerator from '@babel/generator'
import traverse from '@babel/traverse'
import * as chalk from 'chalk'
import { VortexGraph } from './Graph.js'
import { notDeepEqual } from 'assert'

export function FindModulesAndDependencies(entry:string) {

    const node_modules:string = 'node_modules'

    let Graph = new VortexGraph

    GraphDepsAndModsForCurrentFile(entry,Graph);
    
    for (let dep of Graph.Graph.Application){
        let regexp = new RegExp('./')

        if (dep.name.match(regexp) !== null) {
            GraphDepsAndModsForCurrentFile(dep.name,Graph,entry)
        }

    }
        //console.log(c)
        //console.log(modules)
        //console.log(dependencies)
        console.log(Graph.display())
        //resolveDependencies(dependencies,node_modules)
}


function GraphDepsAndModsForCurrentFile(file:string,Graph:VortexGraph,superDependency?:string,nodeLibName?:string){

    const buffer = fs.readFileSync(file,'utf-8').toString();

    let regexp = new RegExp('./')

    //const jsCode = Parser.parse(buffer,{"sourceType":"module"});

    const jsCode = Babel.parse(buffer,{"sourceType":"module"}).program.body


        for (let node of jsCode){
            //console.log(node);
            if (node.type === 'ImportDeclaration'){
                let modules = []
                //console.log(node);
                for (let ImportType of node.specifiers){
                    if (ImportType.type === 'ImportDefaultSpecifier'){
                        let mod=  '_VDefaultImport_' + ImportType.local.name
                        modules.push(mod)
                    }
                    else if (ImportType.type === 'ImportSpecifier') {
                        let mod='_VNamedImport_' + ImportType.imported.name
                        modules.push(mod)
                    }
                }
                Graph.newDependency(node.source.value,modules,file);

                if (node.source.value.match(regexp) !== null){
                    VerifyModulesForDependency(node.source.value,modules);
                }
            }
            if (node.type === 'VariableDeclaration') {
                let modules = []
                if (node.declarations[0].init.type === 'CallExpression') {
                    if(node.declarations[0].init.callee.name === 'require') {
                        if(node.declarations[0].id.type === 'ObjectPattern'){
                            for (let namedRequires of node.declarations[0].id.properties){
                                //console.log(namedRequires.value)
                                modules.push('_VNamedRequire_' + namedRequires.value.name)
                            }
                        }
                        else{
                        modules.push('_VRequire_' + node.declarations[0].id.name)
                        }
                        Graph.newDependency(node.declarations[0].init.arguments[0].value,modules,file);
                       if (node.declarations[0].init.arguments[0].value.match(regexp) !== null){
                            VerifyModulesForDependency(node.declarations[0].init.arguments[0].value,modules);
                       }
                    }
                }
            }
            if (node.type === 'ExpressionStatement') {
                let modules = []
                if (node.expression.type === 'AssignmentExpression') {
                    if(node.expression.left.type === 'MemberExpression' && node.expression.right.type === 'CallExpression'){
                        if(node.expression.right.callee.name === 'require') {
                            modules.push('_VRequire_' + node.expression.right.arguments[0].value)
                            Graph.newDependency(nodeLibName || '_CURRENT_cjs-exports',modules,superDependency); 
                        }
                    }
                }
            }
            
        }

}

function VerifyModulesForDependency(file:string,modules:Array<string>) {

    const buffer = fs.readFileSync(file,'utf-8').toString();

    const jsCode = Babel.parse(buffer,{"sourceType":"module"}).program.body

    let impMods = modules
    let modBuffer = []

    let VDefImport = new RegExp('_VDefaultImport_')
    //let VNamImport = new RegExp('_VNamedImport_')
    let VDefExport = new RegExp('_VDefaultExport_')
    //let VNamExport = new RegExp('_VNamedExport_')

        for (let node of jsCode){
            //console.log(node)
            if (node.type === 'ExportDefaultDeclaration'){
                //console.log(node)
                let defaultMod = node.declaration
                let modid =  defaultMod.id.name
                modBuffer.push('_VDefaultExport_' + modid)
            }
            if (node.type == 'ExportNamedDeclaration'){
                //console.log(node)
                for (let ExportType of node.specifiers){
                    if (ExportType.type === 'ExportSpecifier'){
                        let mod = ExportType.exported.name
                        modBuffer.push('_VNamedExport_' + mod)
                    }
                }
                let mod = node.declaration.id.name
                modBuffer.push('_VNamedExport_' + mod)
            }
    }

    let confModImp = []
    let confModExp = []

    for (let mod of modBuffer){
        if(mod.match(VDefExport) !== null){
            confModExp.push(mod.slice(16))
        }
        else {
            confModExp.push(mod.slice(14))
        }
    }
    for (let mod of impMods) {
        if(mod.match(VDefImport) !== null) {
            //mod.slice(0,15)
            confModImp.push(mod.slice(16))
        }
        else{
            //mod.slice(0,13)
            confModImp.push(mod.slice(14))
        }
    }

    //console.log(confModExp,confModImp)

    let NonExtError = new Error(chalk.bgRed('Non Existant Modules Imported from ' + file))

    for (let impTest of confModImp) {
        if (confModExp.indexOf(impTest) == -1){
            throw NonExtError
        }
    }


    return
}