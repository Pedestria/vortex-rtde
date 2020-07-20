<template>
<div>
 <topbar-button title="Home"/>
 <topbar-button title="About"/>
 <topbar-button title="Docs"/>
</div>
</template>

<script>
import TopbarButton from './TopbarButton.vue'

export default {
    components: {
        TopbarButton
    }
}
</script>