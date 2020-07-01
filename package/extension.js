const fs = require('fs-extra')
const path = require('path')

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

console.log(fixEntryPoint('./test\\poop\\nana.js'))