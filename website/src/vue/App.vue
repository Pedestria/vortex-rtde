<template>
<div>
    <h1>{{title}}</h1>
</div>
</template>

<script>
export default {
    props:['title']
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
