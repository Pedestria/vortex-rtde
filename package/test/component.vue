<template>
<div id="confusing">
  <div class="col">
      {{message}}
  </div>
</div>
</template>

<script>
export default {
    data () {
        return{
            message: 'Hello From Vortex and Vue.js (File Component) SCOPED'
        }
    },
}
</script>

<style lang="css">

#confusing .col{
    font-family: Avenir;
    font-size: 50px;
    color:red;
}

</style>>

