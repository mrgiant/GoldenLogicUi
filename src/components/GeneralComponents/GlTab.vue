<template>



        <div class="block" v-if="keepAlive ? opened : title == selectedTitle" v-show="title == selectedTitle">

            <slot/>

        </div>


</template>

<script>
import { inject, ref, watch } from "vue";
export default {

    // icon and badge are read by the tabs wrapper, which draws the tab itself.
    props:["title", "icon", "badge"],
  setup(props) {


    const selectedTitle = inject('selectedTitle')

    // With keep-alive on the wrapper, a tab stays mounted (hidden) after its
    // first visit instead of being rebuilt every time it is opened.
    const keepAlive = inject('glTabsKeepAlive', ref(false))
    const opened = ref(false)

    watch(selectedTitle, (current) => {
        if (current == props.title) {
            opened.value = true
        }
    }, { immediate: true })

    return{

        selectedTitle,
        keepAlive,
        opened,

    }

  },
};
</script>

<style scoped></style>
