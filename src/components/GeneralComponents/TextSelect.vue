
<script setup>
import { onMounted, ref } from 'vue';

defineProps({


    is_required: {
         type: Boolean,
        default: false
        },

    errorMessage: {
        type: String,
        default:'',
    },
    modelValue: {
        type: String,
        required: true,
    },


    options: {
         type: Array,
        default: []
        },



    type: {
         type: String,
        default: 'text'
        },
        field_name: {
         type: String,
        default: ''
        },

        description: {
         type: String,
        default: ''
        },

        is_required: {
         type: Boolean,
        default: false
        }
});

defineEmits(['update:modelValue']);

const select = ref(null);

onMounted(() => {
    if (select.value.hasAttribute('autofocus')) {
        select.value.focus();
    }
});

defineExpose({ focus: () => select.value.focus() });
</script>





<template>


<div
  class="leading-6 text-left break-words text-neutral-800"

>
  <label
    class="inline-block mb-2 text-sm font-bold text-left text-gray-900 " :class="is_required?'required':''"


    >{{ field_name }}</label
  >





  <select

  :class="errorMessage==''? 'border-0 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600':'border border-red-500'"

    class="block w-full h-10 px-3 py-1 m-0 text-base font-normal text-gray-900 rounded-md shadow-sm appearance-none sm:text-sm sm:leading-6 placeholder:text-gray-400"
    :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        ref="select"


  >




     <option v-for="(option, index) in options">{{ option }}</option>


  </select>

  <span class="block mt-1 text-sm font-normal leading-5 text-red-500">{{ errorMessage }}</span>


<small
  class="block mt-1 text-sm font-normal leading-5 text-gray-500"

>
{{ description }}
</small>

</div>

</template>



