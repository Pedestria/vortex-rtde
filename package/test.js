const fs = require('fs-extra')
const path = require('path')
const css = require('css')
const chalk = require('chalk')
// const Babel = require('@babel/parser')
// const VueTemplate = require('vue-template-compiler')
// const compiler = require('@vue/component-compiler-utils')
// const {transformSync} = require('@babel/core')
// const sass = require('node-sass')

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

// const result = VueTemplate.parseComponent(fs.readFileSync('./test/component.vue').toString())


// //console.log(result.script.content)
// const {render} = VueTemplate.compileToFunctions(result.template.content)

// fs.writeFileSync('./vuefunc.js',render.toString())
// console.log('Success!')
// if(result.styles[0].lang === 'scss'){
//     var final = sass.renderSync({data:result.styles[0].content})
//     console.log(final.css.toString())
// }

function LocalizedResolve(rootFileDirToEntry,dependencyLocalDir){

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

console.log(LocalizedResolve('./ts/live/Bundle.ts','../../vortex.panel.js'))


