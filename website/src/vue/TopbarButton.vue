<template>
<button v-on:click="handleClick">
    {{title}}
</button>
</template>

<script>
export default {
    props:['title'],
    methods: {
        handleClick: function() {
            console.log(`${this.title} Button Has Been Clicked!`)
        }
    }
}
</script>

<style>

button {
    font-family: Roboto;
    display: block;
    background-color: #a36a00;
    height: 50px;
    width: 100px;
    transition: background-color 1s;
    outline: none;
    margin-left: auto;
    margin-right: auto;
}

button:hover {
    background-color: #e79600;
    cursor: pointer;
}

</style>