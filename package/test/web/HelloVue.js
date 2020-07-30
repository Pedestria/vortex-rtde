import Vue from 'vue'
import Compiler from 'vue-template-compiler'
import React from 'react';

const {render} = Compiler.compileToFunctions('<div id="app">{{message}}<button-counter/></div>')

var render2 = Compiler.compileToFunctions('<button v-on:click="count++">{{ count }}</button>').render

Vue.component("button-counter",{
    data: function (){
        return {
            count:0
        }
    },
    render: render2
})


var app = new Vue({
    el:'#app',
    render,
    data: {
        message: 'Vue.js (js not .vue) realtime development Hell yeah!!!'
    }
})

export function Com (props){
    return (<div>
        <h1>Hello From Com!!! React Update!!!</h1>
    </div>);
}