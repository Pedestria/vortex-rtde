<template>
<div>
    <h1>{{title}}</h1>
    <topbar/>
    <docs/>
</div>
</template>

<script>
import Topbar from './Topbar.vue'
import Docs from './Docs.vue'

export default {
    props:['title'],
    components: {
        Topbar,
        Docs
    }
}
</script>

<style>

div {
    font-family: Roboto;
    text-align: center;
}

h1 {
    font-family: inherit;
    font-size: 45px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

</style>
