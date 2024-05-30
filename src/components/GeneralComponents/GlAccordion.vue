

<template>



  <div>
        <h2>
          <button
          @click="toggle"
            type="button"
            class="flex items-center justify-between w-full gap-3 p-5 font-medium text-gray-500 border border-gray-200 rtl:text-right dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
  
            :class="{
            'rounded-t-xl': isFirstAccordion,
            'border-b-0': !isLastAccordion,
  
            'bg-gray-100 dark:bg-gray-800': isOpen
          }"
  
            aria-expanded="true"
          >
            <span class="flex items-center">
              {{ title }}
            </span>
  
            <svg
            v-if="!isOpen"
              class="w-3 h-3 rotate-180 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
  
            <svg
               v-if="isOpen"
              class="w-3 h-3 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              ></path>
            </svg>
          </button>
        </h2>
  
  
        <div v-if="isOpen"
  
        :class="{
  
            'border-b-0': !isLastAccordion,
            'border-t-0': isLastAccordion,
  
          }"
  
        class="p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
  
            <slot/>
  
        </div>
  
  
      </div>
  
  
</template>
  
  <script>
  import { ref, onMounted, onUnmounted, inject, computed } from 'vue';
  
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
    },
    setup() {
      const isOpen = ref(false);
      const accordionsWrapper = inject('accordionsWrapper');
  
      const generateUUID = () => {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
          d += performance.now(); // use high-precision timer if available
        }
        var newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
  
        return newGuid;
      };
  
      const instanceId = generateUUID();
      const instance = { isOpen, id: instanceId }; // Initialize instance with isOpen and id
  
      const accordions = computed(() => accordionsWrapper.accordions.value);
  
      const isFirstAccordion = computed(() => {
        return accordions.value.length > 0 && accordions.value[0].id === instanceId;
      });
  
      const isLastAccordion = computed(() => {
        return accordions.value.length > 0 && accordions.value[accordions.value.length - 1].id === instanceId;
      });
  
      onMounted(() => {
        accordionsWrapper.registerAccordion(instance);
  
      });
  
      onUnmounted(() => {
        accordionsWrapper.unregisterAccordion(instance);
  
      });
  
      const toggle = () => {
        accordionsWrapper.toggleAccordion(instance);
      };
  
      return { isOpen, isFirstAccordion, isLastAccordion, toggle };
    },
  };
  </script>
  