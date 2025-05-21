import * as css from 'css'
import { FileImportLocation } from '../importlocations/FileImportLocation'
import { resolveDependencyType } from '../DependencyFactory'
import { CSSDependency } from '../dependencies/CSSDependency'

export function SearchAndGraph(ast:css.Stylesheet,Dep:CSSDependency){
    for(let rule of ast.stylesheet.rules){
        if(rule.type){
        //Font Dependencies
            let r = rule as css.Rule;
            if(r.type === 'font-face'){
                for(let dec of r.declarations){
                    if(dec.property === 'src'){
                        let depname = parseDependencyFromValue(dec.value)
                        let impLoc = new FileImportLocation(Dep.name,null,depname,null);
                        Dep.dependencies.push(resolveDependencyType(depname,impLoc,Dep.name))
                    }
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