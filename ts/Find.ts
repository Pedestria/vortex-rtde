import * as fs from 'fs'
import * as path from 'path'
import * as Babel from '@babel/parser'
import * as BabelGenerator from '@babel/generator'
import traverse from '@babel/traverse'

export function FindModulesAndDependencies(entry:string) {

    const node_modules:string = 'node_modules'

    const buffer = fs.readFileSync(entry,'utf-8').toString();
    //const jsCode = Parser.parse(buffer,{"sourceType":"module"});

    const jsCode = Babel.parse(buffer,{"sourceType":"module"}).program.body

    let modules = []
    let dependencies = []

        for (let node of jsCode){
            if (node.type === 'ImportDeclaration'){
                //console.log(node);
                dependencies.push(node.source.value)
                for (let ImportType of node.specifiers){
                    if (ImportType.type === 'ImportDefaultSpecifier'){
                        let mod=  '_VortexDefaultImport_' + ImportType.local.name
                        modules.push(mod)
                    }
                    else if (ImportType.type === 'ImportSpecifier') {
                        let mod='_VortexNamedImport_' + ImportType.imported.name
                        modules.push(mod)
                    }
                }
                //c++
            }
            if (node.type === 'ExportDefaultDeclaration'){
                //console.log(node)
                let defaultMod = node.declaration
                let modid =  defaultMod.id.name
                modules.push('_VortexDefaultExport_' + modid)
            }
            if (node.type == 'ExportNamedDeclaration'){
                //console.log(node)
                for (let ExportType of node.specifiers){
                    if (ExportType.type === 'ExportSpecifier'){
                        let mod = ExportType.exported.name
                        modules.push('_VortexNamedExport_' + mod)
                    }
                }
            }
            
            }
            //if (node.type === 'ExportNamedDeclaration'){
                
            //}

        //console.log(c)
        console.log(modules)
        console.log(dependencies)
        resolveDependencies(dependencies,node_modules)
}

function resolveDependencies(deps:Array<String>,loc:String){
    let resolvedDeps = []
    let paths = []
    let regexp = new RegExp('./')

    for (let dep of deps){
         if (dep.match(regexp) === null ){
             resolvedDeps.push(dep)
             paths.push(loc + '/' + dep + '/index.js')
             //paths.push(resolve.sync(dep,{basedir:__dirname}))
         }
         else{
             resolvedDeps.push(dep)
             paths.push(dep)
             //paths.push(path.resolve(__dirname + dep))
         }
    }
    //console.log(resolvedDeps)
    console.log(paths)
    return

}