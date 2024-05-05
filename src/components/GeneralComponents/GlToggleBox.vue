<script setup>
import { onMounted, ref } from "vue";

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

  description: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const input = ref(null);

onMounted(() => {



    if (props.model_value != "") {
        emit("update:modelValue", props.model_value);
        input.value.checked = props.model_value == 1 ? true:false;

    }


    if (props.modelValue!="") {
        emit("update:modelValue", props.modelValue);

        input.value.checked = props.modelValue == 1 ? true:false;
    }

});


const handleChange = event => {
  const value = event.target.checked ? 1 : 0;
  emit('update:modelValue', value);
};


</script>

<template>
  <div :class="field_name" v-if="show">

    <div class="mb-4">
    <li class="flex justify-between px-6 py-3 -mb-px border border-gray-300 no-underlin">
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

  <div class="mb-4" :class="field_name" v-if="!show">
    <li class="flex justify-between px-6 py-3 -mb-px border border-gray-200 rounded-lg no-underlin dark:border-gray-600 dark:focus:border-frontenddark">
      {{ label_name }}

      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          :name="field_name"
          :id="field_name"
          :value="model_value || modelValue"
          :checked="model_value==1 || modelValue==1"
          :true-value="1"
          :false-value="0"
          ref="input"
          @change="handleChange"
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
