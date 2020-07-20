<template>
<div>
 <ul>
    <dock-button v-for="button in buttons" :key="button.id" :dockB="button"/>
 </ul>
</div>
  
</template>

<script>
import DockButton from './DockButton.vue'

export default {
    data () {
        return {
            buttons:[
                {id:0,label:'Intro',children:[
                    {label:'Getting Started'}
                ]},
                {id:1,label:'Features'},
                {id:2,label:'FAQ'}
            ]
        }
    },
    components: {
        DockButton
    }
}
</script>

<style scoped>

ul{
    padding: 0;
}

li {
    font-family: Roboto;
    font-size:30px;
    max-width: 150px;
    display: block;
    margin-left:0;
    background-color: brown;
    transition: background-color 0.25s;
}

li:hover {
    background-color:orange;
    cursor: pointer;
}

</style>