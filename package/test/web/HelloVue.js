import Vue from 'vue'
import Compiler from 'vue-template-compiler'
import React from 'react';

const {render} = Compiler.compileToFunctions('<div id="app">{{message}}</div>')


var app = new Vue({
    el:'#app',
    render,
    data: {
        message: 'FUCK WEBPACK DEV SERVER!!!!!!! Hell yeah!!!'
    }
})

export function Com (props){
    return (<div>
        <h1>Hello From Com!!! React Update!!!</h1>
    </div>);
}