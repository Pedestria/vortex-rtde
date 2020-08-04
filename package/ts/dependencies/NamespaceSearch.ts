import traverse from '@babel/traverse'
import * as Babel from '@babel/parser'
import {readFileSync} from 'fs-extra'
import { ParseSettings } from '../Options';

export function findModulesUnderNamespace(file:string,Namespace:string){
 
    const buffer = readFileSync(file,'utf-8').toString();

    const jsCode = Babel.parse(buffer,ParseSettings)

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

export function searchForModuleUnderNamespace(file:string,Module:string,Namespace:string){

    const buffer = readFileSync(file,'utf-8').toString();

    const jsCode = Babel.parse(buffer,ParseSettings)

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

export function searchForDefaultNamespace(file:string,Namespace:string,ControlPanel){ 
    const buffer = readFileSync(file).toString()

    const jsCode = Babel.parse(buffer,ParseSettings)

    let rc = false

    traverse(jsCode, {
        MemberExpression: function(path){
            if(path.node.object.type === "Identifier" && path.node.object.name === 'module' && path.node.property.name === 'exports' && path.parent.type === 'AssignmentExpression' && path.parent.right.type === 'Identifier' && path.parent.right.name === Namespace){
                rc = true
            } else if(path.node.object.type === "Identifier" && path.node.object.name === 'module' && path.node.property.name === 'exports' && path.parent.type === 'AssignmentExpression' && path.parent.right.type === 'CallExpression' && path.parent.right.callee.type === 'Identifier' && path.parent.right.callee.name === 'factory'){
                rc = true
            }
            else if(ControlPanel.isProduction){
                if(path.node.object.type === "Identifier" && path.node.object.name === 'module' && path.node.property.name === 'exports' && path.parent.type === 'AssignmentExpression'){
                    rc = true
                }
            }
        }
    })

    return rc

}