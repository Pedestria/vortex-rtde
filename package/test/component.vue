<template>
 <div id="confusing">
   <div class="col">
    {{message}}
   </div>
   <button v-on:click="handleClick">Vue Button</button>
   <img src="./img/1200px-React-icon.png"/>
 </div>
</template>

<script>

import NewComponent from './newComponent.vue'

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
        NewComponent
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

