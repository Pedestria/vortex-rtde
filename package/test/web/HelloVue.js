import Vue from 'vue'
import Compiler from 'vue-template-compiler'

const Render1 = Compiler.compileToFunctions(`<div id="app">{{message}}<vortex-component></vortex-component></div>`).render
const Render2 = Compiler.compileToFunctions(`<p>{{hello}}</p>`).render

Vue.component('vortex-component', {
    data () {
        return {
            hello: 'Hello! I am a Vue Component in Vortex!'
        }
    } ,
    render: Render2
})

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello From Vue and Vortex!!'
    },
    render: Render1,
})
