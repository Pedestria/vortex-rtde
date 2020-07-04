const fs = require('fs-extra')
const path = require('path')
const css = require('css')
const chalk = require('chalk')
const Babel = require('@babel/parser')
const envify = require('loose-envify/loose-envify')

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

fs.writeJSONSync('./vuetest.json',Babel.parse(fs.readFileSync('./test/func.js').toString()))



