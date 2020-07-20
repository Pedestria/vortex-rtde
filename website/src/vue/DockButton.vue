<template>
 <div class="dockButton">
    <label>{{dockB.label}}</label>

    <ul v-if="dockB.children && dockB.children.length > 0">
      <dock-button v-for="button in dockB.children" :dockB="button" v-bind:key="button.label"/>
    </ul>
 </div>
</template>

<script>
export default {
    name:'dock-button',
    props: {dockB:Object}
}
</script>