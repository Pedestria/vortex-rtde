<template>
 <div id="confusing">
   <div class="col">
    {{message}}
   </div>
   <button v-on:click="handleClick">Vue Button</button>
   <other-component/>
 </div>
</template>

<script>
import OtherComponent from './newComponent.vue'

export default {
    data () {
        return{
            message: 'Hello From Vortex and Vue.js (File Component) SCOPED'
        }
    },
    methods: {
        handleClick: function() {
            console.log('Vue Button Clicked!!')
        }
    },
    components: {
        OtherComponent
    }
}
</script>

<style lang="css" scoped>

.col{
    font-family: Avenir;
    font-size: 50px;
    color:red;
}

button {
    font-family: Avenir;
    font-size: 30px;
}

</style>>

