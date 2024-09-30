<script setup>
import { ref,computed } from "vue";

const props = defineProps({
  is_required: {
    type: Boolean,
    default: false,
  },

  show: {
    type: Boolean,
    default: false,
  },

  error_message: {
    type: String,
    default: "",
  },
  model_value: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String,Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  field_name: {
    type: String,
    default: "",
  },

  label_name: {
    type: String,
    default: "",
  },

  has_label_up: {
    type: Boolean,
    default: false,
  },


  description: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);



const input = ref(null);








const proxyValue = computed({

    get()
    {
        return props.modelValue;
    },
    set(newValue)
    {
        emit("update:modelValue", newValue);   

    }
   
   
    });





</script>

<template>
  <div :class="field_name" v-if="show">

    <div>
    <li class="flex justify-between p-2 -mb-px border border-gray-300 no-underlin">
      {{ label_name }}

      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          :name="field_name"
          :id="field_name"
          :checked="modelValue"
          :true-value="1"
          :false-value="0"
          ref="input"
          disabled

        />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
        ></div>

      </label>
    </li>
    </div>


    <hr class="!opacity-100 bg-gray-200 border-0 dark:bg-gray-700">
  </div>

  <div  :class="field_name" v-if="!show">
    <div class=" flex justify-between items-center" v-if="has_label_up">
        <label  class="gl-label-form">{{ label_name }}</label>
    </div>
    <li class="flex justify-between p-2 -mb-px border border-gray-200 rounded-lg no-underlin dark:border-gray-600 dark:focus:border-primaryDark">
      {{ label_name }}

      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          :name="field_name"
          :id="field_name"
          :true-value="1"
          :false-value="0"
          ref="input"
          v-model="proxyValue"
         
        />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
        ></div>

      </label>
    </li>

    <span class="gl-span-form-error">{{ error_message }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>
  </div>
</template>
