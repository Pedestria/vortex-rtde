import * as css from 'css'
import { Transport } from '../Transport'
import { FileDependency } from '../dependencies/FileDependency'
import { FileImportLocation } from '../importlocations/FileImportLocation'
import { VortexGraph } from '../Graph'
import { resolveDependencyType } from '../DependencyFactory'
import { CSSDependency } from '../dependencies/CSSDependency'

export function SearchAndGraph(ast:css.Stylesheet,Dep:CSSDependency){
    for(let rule of ast.stylesheet.rules){
        //Font Dependencies
        if(rule.type === 'font-face'){
            for(let dec of rule.declarations){
                if(dec.property === 'src'){
                    let depname = parseDependencyFromValue(dec.value)
                    let impLoc = new FileImportLocation(ast.stylesheet.source,null,depname,null);
                    Dep.dependencies.push(resolveDependencyType(depname,impLoc,ast.stylesheet.source))
                }
            }
        }
    }
}

function parseDependencyFromValue(value:string){
    let depName
    if(value.includes('url')){
        depName = value.slice(5)
        depName = depName.slice(0,depName.indexOf(')')-1)
    }
    return depName
}