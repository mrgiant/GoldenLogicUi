<template>
  <div class="flex flex-col gap-9" :class="cardClass">
    <div
      class="bg-white border rounded-lg border-stroke shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="px-3 py-4 border-b border-stroke dark:border-strokedark">
        <h3 class="font-semibold text-black dark:text-white">
          <slot name="header"></slot>
        </h3>
      </div>




      <div v-if="$slots.body" class="p-6" :class="bodyClass">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>



<script setup>
import { computed } from 'vue';



const props = defineProps({
   

  class: {
        type: String,
        default: "",
    },
    body_class: {
        type: String,
        default: "",
    },

   
});



const cardClass = computed(() => {

        return props.class;
     
    });

    const bodyClass = computed(() => {

return props.body_class;

});





</script>



<style scoped></style>
