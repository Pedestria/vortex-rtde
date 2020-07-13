const fs = require('fs-extra')
const path = require('path')
const css = require('css')
const chalk = require('chalk')
const Babel = require('@babel/parser')
const VueTemplate = require('vue-template-compiler')
const compiler = require('@vue/component-compiler-utils')
const {transformSync, template} = require('@babel/core')
const traverse = require('@babel/traverse')
const t = require('@babel/types')
const generate = require('@babel/generator')
const {v4} = require('uuid')
const hash = require('hash-sum')
const sass = require('node-sass')
const { indexOf } = require('lodash')
// const compiler = require('@vue/component-compiler')


function amendEntryPoint(entry){

    let shortEntry = entry.slice(2)

    while(shortEntry.includes('/')){
        let i = shortEntry.indexOf('/')
        let a = shortEntry.slice(0,i)
        let b = shortEntry.slice(i+1)
        shortEntry = `${a}\\\\${b}`
    }
    return `./${shortEntry}`
}

function fixEntryPoint(entry){

    let shortEntry = entry.slice(2)

    while(shortEntry.includes('\\')){
        let i = shortEntry.indexOf('\\')
        let a = shortEntry.slice(0,i)
        let b = shortEntry.slice(i+1)
        shortEntry = `${a}\\\\${b}`
    }
    return `./${shortEntry}`
}

function getFileExtension(filename){
    let i = filename.lastIndexOf('.')
    return filename.slice(i)
}

let array = []

let extensions = ['.css','.png','.otf']

async function isJs(filename){

    if(path.basename(filename) === filename){
        return true
    }
    else if(extensions.includes(getFileExtension(filename))){
        return false
    }
    else if(filename.includes('./') && path.extname(filename) === ''){
        return true
    }
    else if(filename.includes('.js') || filename.includes('.mjs') || filename.includes('.') == false){
        return true
    }
    else {
        throw new Error(chalk.red(`Cannot resolve extension: "${getFileExtension(filename)}" If you wish to include this in your Solar System, include it in the resolvable extensions option in the vortex.panel.js`))
    }
}

//isJs('../ogpoe/esmoep/mbeos').catch(err => { console.log(err)}).then( result => {console.log(result)})
//console.log(path.extname('../gopp/mama')

const CSSInjector = template("if(!gLOBAL_STYLES.includes(DEPNAME)){var style = document.createElement('style'); style.innerHTML=CSS;document.head.appendChild(style);gLOBAL_STYLES.push(DEPNAME)}")


let filename = './test/component.vue'

let scopeID = `data-v-${v4()}`

const result = compiler.parse({source:fs.readFileSync(filename).toString(),filename,compiler:VueTemplate})


const renderFuncBody = compiler.compileTemplate({source:result.template.content,compiler:VueTemplate,filename})

const ASTRenderFuncBody = Babel.parse(renderFuncBody.code,{allowReturnOutsideFunction:true})

let scoped = result.styles[0].scoped

var cssResult
if(scoped){
cssResult = compiler.compileStyle({source:result.styles[0].content,preprocessLang:result.styles[0].lang,scoped,id:scopeID}).code
} else{
    cssResult = result.styles[0].content
}

const MainAST = Babel.parse(transformSync(result.script.content).code,{"sourceType":"module"})

let index = findDefaultExportExpression()

let props = MainAST.program.body[index].declaration.properties

for(let prop of props){
    if(prop.type === 'ObjectProperty' && prop.key === t.identifier('render') && path.parent.type !== 'ReturnStatement'){
        prop.value = t.identifier('render')
        return
    }
}
props.push(t.objectProperty(t.identifier('render'),t.identifier('render')))
if(scoped){
    props.push(t.objectProperty(t.identifier('_scopeId'),t.stringLiteral(scopeID)))
}

console.log(MainAST.program.body[index].declaration.properties)



MainAST.program.body.reverse()
MainAST.program.body.push(ASTRenderFuncBody.program.body[0])
MainAST.program.body.reverse()

MainAST.program.body.push(CSSInjector({DEPNAME:t.stringLiteral('style1'),CSS:t.stringLiteral(cssResult)}))

const finalCode = generate.default(MainAST).code


function findDefaultExportExpression () {
    for(let node of MainAST.program.body){
        if(node.type === 'ExportDefaultDeclaration'){
            return MainAST.program.body.indexOf(node)
        }
    }
}




// fs.writeFileSync('./vuefunc.js',render.toString())
// console.log('Success!')
// if(result.styles[0].lang === 'scss'){
//     var final = sass.renderSync({data:result.styles[0].content})
//     console.log(final.css.toString())
// }

// function LocalizedResolve(rootFileDirToEntry,dependencyLocalDir){

//     if(rootFileDirToEntry == dependencyLocalDir){
//         return rootFileDirToEntry
//     }
//     else if(path.dirname(dependencyLocalDir) == './'){
//         return dependencyLocalDir
//     }

//     let dirname = path.dirname(rootFileDirToEntry)
//     let localFilePath = dependencyLocalDir

//     return './' + path.join(dirname,localFilePath)

// }
// console.log(path.dirname('./out/webapp.js'))
// console.log(path.relative('./out/','./node_modules'))





