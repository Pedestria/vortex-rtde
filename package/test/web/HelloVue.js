import Vue from 'vue'
import Compiler from 'vue-template-compiler'

const {render} = Compiler.compileToFunctions('<div id="app">{{message}}<file-component/></div>')


var app = new Vue({
    el:'#app',
    render,
    data: {
        message: 'Hello there from Vue.js!'
    },
    components: {
        'file-component':() => import('./outputVue.js')
    }
})