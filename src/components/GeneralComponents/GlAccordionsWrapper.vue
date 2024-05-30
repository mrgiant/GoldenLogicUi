

<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { ref,provide } from 'vue';

export default {
  setup() {
    const accordions = ref([]);

    const registerAccordion = (accordion) => {
      accordions.value.push(accordion);
    };




    const unregisterAccordion = (accordion) => {
      const index = accordions.value.indexOf(accordion);
      if (index > -1) {
        accordions.value.splice(index, 1);
      }
    };

    const toggleAccordion = (accordion) => {
      accordions.value.forEach((acc) => {
        if (acc !== accordion) {
          if (acc.isOpen && acc.isOpen.value !== undefined) {
            acc.isOpen.value = false;
          }
        }
      });
      if (accordion.isOpen && accordion.isOpen.value !== undefined) {
        accordion.isOpen.value = !accordion.isOpen.value;
      }
    };

    provide('accordionsWrapper', {
      registerAccordion,
      unregisterAccordion,
      toggleAccordion,
      accordions,
    });

    return {  };
  },
};
</script>
