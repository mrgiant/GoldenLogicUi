<script setup>
import { computed, onMounted, ref, watch } from "vue";

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
    type: [String, Number],
    default: "",
  },

  modelValue: {
    type: [String, Number],
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

  input_text: {
    type: String,
    default: "",
  },

  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "keydown"]);

const input = ref(null);

onMounted(() => {
  if (input.value !== null && input.value.hasAttribute("autofocus")) {
    input.value.focus();
  }

  /*

    if (props.model_value!="") {
        emit("update:modelValue", props.model_value);
        input.value.value = props.model_value;
    }

    */

  /*
    if (props.modelValue!="") {
        emit("update:modelValue", props.modelValue);
        input.value.value = props.modelValue;
    }

    */
});

/*
watch(
    () => props.modelValue,
    (newValue, oldValue) => {

        if(newValue)
        {
            emit("update:modelValue", newValue);
            input.value.value = newValue;
        }
       
    },
    { immediate: true, deep: true }
);
*/

const proxyValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
    
  },
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold dark:text-white">{{ label_name }}</h3>

    <p class="mt-1 text-gray-900 dark:text-white">
      {{ type == "password" ? modelValue.replace(/./g, "*") : modelValue }}
    </p>

    <hr class="!opacity-100 bg-gray-200 border-0 dark:bg-gray-700" />
  </div>

  <div :class="field_name" v-if="!show">
    <label
      v-if="label_name"
      :class="{
        'gl-label-form': error_message == '',
        'gl-label-form-invalid': error_message !== '',
        required: is_required,
      }"
      :for="field_name"
      >{{ label_name }}</label
    >
    <div class="flex items-center">
      <div class="relative w-full">
        <input
          :required="is_required"
          :name="field_name"
          :id="field_name"
          :class="{
            'gl-input-form-text': error_message == '',
            'gl-input-form-invalid-text': error_message !== '',
          }"
          class="!border-e-0 !rounded-s-lg"
         
          :type="type"
          v-model="proxyValue"
          @keydown="$emit('keydown', $event)"
          ref="input"
          :placeholder="placeholder"
        />
      </div>

      <label
     
        class="h-10 z-10 inline-flex items-center flex-shrink-0 px-4  text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 dark:text-gray-400 rounded-e-lg focus:outline-none dark:bg-gray-700 dark:border-gray-600"
      >
        {{ input_text }}
      </label>
    </div>

    <span class="gl-span-form-error">{{ error_message }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>
  </div>
</template>
