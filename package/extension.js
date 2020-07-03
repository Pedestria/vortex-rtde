const fs = require('fs-extra')
const path = require('path')
const css = require('css')

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

let array = []


var o = new Object('star')
Object.defineProperty(o,'code',{
    value:"HI I AM CODE!",
    writable:false
})
array.push(o)

var o2 = new Object('star2')
Object.defineProperty(o2,'code',{
    value:"HI I AM CODE 2!",
    writable:false
})

array.push(o2)

var o3 = new Object('star3')
Object.defineProperty(o3,'code',{
    value:"HI I AM CODE 3!",
    writable:false
})

array.push(o3)

for(let bundle of array){
    if(bundle.valueOf() === 'star3'){
        console.log(bundle.code)
    }
    else{
        console.log(bundle.valueOf().toString())
    }
}


