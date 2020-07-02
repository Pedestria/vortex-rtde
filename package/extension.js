const fs = require('fs-extra')
const path = require('path')
const css = require('css')
const { includes } = require('lodash')

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

let ast = css.parse(fs.readFileSync('./test/web/styles.css','utf-8'),{source:'./test/web/styles.css'})

console.log(ast.stylesheet.rules[0])

replaceFileDependencyIntoCSS(ast,'./fonts/AvenirLTStd-Medium.otf','./assets/AvenirLTStd-Medium.otf')

console.log(ast.stylesheet.rules[0])