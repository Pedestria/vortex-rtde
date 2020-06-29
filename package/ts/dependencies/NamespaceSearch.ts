import traverse from '@babel/traverse'
import * as Babel from '@babel/parser'
import * as fs from 'fs-extra'

export function findModulesUnderNamespace(file:string,Namespace:string){
 
    const buffer = fs.readFileSync(file,'utf-8').toString();

    const jsCode = Babel.parse(buffer,{"sourceType":"module"})

    let modules:Array<string> = []


    traverse(jsCode,{
        MemberExpression : function (path){
                if(path.node.object.type === 'Identifier'){
                    var namespace = path.node.object.name
                }
                if(path.node.property.type === 'Identifier'){
                    if(namespace == Namespace){
                        modules.push(path.node.property.name)
                    }
                }
            }
        })
    return modules

}

export function searchForModuleUnderNamespace(file:string,Module:string,Namespace:string):boolean{

    const buffer = fs.readFileSync(file,'utf-8').toString();

    const jsCode = Babel.parse(buffer,{"sourceType":"module"})

    let rc = false

    traverse(jsCode,{
        MemberExpression : function (path) {
                if(path.node.object.type === 'Identifier'){
                    var namespace = path.node.object.name
                }
                if(path.node.property.type === 'Identifier'){
                    if(namespace == Namespace){
                        if(path.node.property.name === Module){
                            rc = true
                        }
                    }
                }
            }
        })
    return rc
}