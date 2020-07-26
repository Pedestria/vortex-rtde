const { readFileSync } = require("fs-extra");

let commentregexp = /(\/\/.*)|(\/\*(.|\n)*\*\/)/g

let requestregexp = /(import ((['|"][\w\/.]+['|"])|({[\w\W,]+} from ['|"][\w\/.]+['|"])|(\w+)[,| ](?:(?<=,)( {\w+} from ['|"][\w\/.]+['|"])|(from ['|"]\w+['|"]))))|((const|var|let)( +[\w$!]+ *= *require\(['|"][\w\/.]+['|"]\)))/g

let code0 = `

//Comment Here!!

/* 
import _ from 'lodash'
*/

import React from 'react'
import React, {Component} from 'react'
import {Component,Suspense} from 'react'

import './styles.css';

const _ = require('lodash');
var moment=require('moment');
let $ = require('jquery');

class Baby {

}
`

function parseRequests(code){
    let newcode = code.replace(commentregexp,"");
    return newcode.match(requestregexp);
}

console.log(parseRequests(code0));


function fixDependencyName(name){
    if(name[0] === '@'){
        name = name.slice(1);
    }
    let NASTY_CHARS = /(@|\/|\^|\$|#|\*|&|!|%|-)/g
    return name.replace(NASTY_CHARS,"_");

}

// console.log(fixDependencyName("react-dom"))

function minifyCss(styles) {

    let regexp = /(\s*|(\n)*|(\r\n)*)/g
    return styles.replace(regexp,"");
}

// let file = readFileSync("./test/web/styles.css").toString()

// console.log(minifyCss(file))


