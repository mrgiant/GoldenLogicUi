
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
    type: [String,Number],
    default: "",
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
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue","keydown"]);

const input = ref(null);

onMounted(() => {

    if (input.value !== null && input.value.hasAttribute('autofocus')) {
    input.value.focus();
  }

 




});


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

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>







    <p :id="field_name" class="mb-4 text-base text-gray-900 input_tr_show dark:text-white">{{ model_value }}</p>

    <hr class="!opacity-100 bg-gray-200 border-0 dark:bg-gray-700">
  </div>

  <div class="mb-4" :class="field_name" v-if="!show">
    <label
      :class="{
        'gl-label-form': error_message == '',
        'gl-label-form-invalid': error_message !== '',
        required: is_required,
      }"
      :for="field_name"
      >{{ label_name }}</label
    >





    <textarea
      :required="is_required"
      :name="field_name"
      :id="field_name"
      :class="{
        ' gl-textarea-form   mt-4 ': error_message == '',
        ' gl-textarea-form-invalid   mt-4 ': error_message !== '',
      }"
      :type="type"
      v-model="proxyValue"
      @keydown="$emit('keydown', $event)"
      ref="input"
      rows="4"
      :placeholder="placeholder"
    ></textarea>

    <span class="gl-span-form-error">{{ error_message }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>
  </div>
</template>











