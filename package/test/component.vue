<template>
  <div id="app">
      {{message}}
  </div>
</template>

<script>
var $render = function anonymous(
) {
with(this){return _c('div',{attrs:{"id":"app"}},[_v("\n    "+_s(message)+"\n")])}
}
export default {
    data () {
        return{
            message: 'Hello From Vortex and Vue.js (File Component)'
        }
    },
    render:$render

     

}
</script>

<style lang="scss">

$a:"div";

#{$a}{
    font-family: Avenir;
    font-size: 50px;
}
</style>