import Vue from 'vue'
import Compiler from 'vue-template-compiler'
import '../styles/main.css'

import App from './vue/App.vue'

const {render} = Compiler.compileToFunctions('<div id="app"><app title="Vue Props Play!"/></div>')

var app = new Vue({
    el:'#app',
    render,
    components: {
        App
    }
})