
<script setup>
import { onMounted, ref, watch } from "vue";

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
    default: null,
  },

  modelValue: {
    type: [String,Number],
    default: "",
  },

  model_value_translate: {
    type: [String,Object],
    default: null,
  },

  modelValueTranslate: {
    type: [String,Object],
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

  get_field_translations: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  translatable: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue","update:modelValueTranslate","keydown"]);

const input = ref(null);
const input_translate = ref(null);




onMounted(() => {


    if (input.value !== null && input.value.hasAttribute('autofocus')) {
    input.value.focus();
  }

  if(props.model_value)
  {
     emit('update:modelValue', props.model_value);
     input.value.value=props.model_value;




  }

  if(props.model_value_translate)
  {
    // emit('update:modelValueTranslate', props.model_value_translate);
    // input_translate.value.value=props.model_value_translate;

    // console.log('model_value_translate',props.model_value_translate);



  }
  if(props.translatable)
  {
    axios

        .post(`/admin/get_field_translations`, {
                   model: props.translatable.model,
                   row_id: props.translatable.row_id,
                   field: props.translatable.field,



                })
        .then((response) => {



              input_translate.value.value=JSON.stringify(response.data);
              emit('update:modelValueTranslate', JSON.stringify(response.data));
              //var event = new Event('change');
              //input_translate.dispatchEvent(event);




        })
        .catch((error) => {
            // handle error
            console.log(error);
        });
  }




});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>

    <input
      type="hidden"
      data-i18n="true"
      :name="field_name + '_i18n'"
      :id="field_name + '_i18n'"
      ref="input_translate_s"
      v-model="inputTranslateValue"


    />





    <p :id="field_name" class="mb-4 text-base text-gray-900 input_tr_show dark:text-white">{{ model_value }}</p>

    <hr class="!opacity-100 bg-gray-200 border-0 dark:bg-gray-700">
  </div>

  <div class="mb-4" :class="field_name" v-if="!show">
    <label
      :class="{
        'gl-label-translation-form': error_message == '',
        'gl-label-translation-form-invalid': error_message !== '',
        required: is_required,
      }"
      :for="field_name"
      >{{ label_name }}</label
    >

    <span
      class="language-label js-language-label bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
    ></span>

    <input
      class="mb-4"
      type="hidden"
      data-i18n="true"
      :name="field_name + '_i18n'"
      :id="field_name + '_i18n'"

      @input="$emit('update:modelValueTranslate', $event.target.value)"
      ref="input_translate"
    />

    <input
      :required="is_required"
      :name="field_name"
      :id="field_name"
      :class="{
        ' gl-input-form form-input-translation  mt-2 ': error_message == '',
        ' gl-input-form-invalid form-input-translation  mt-2 ': error_message !== '',
      }"
      :type="type"

      @input="$emit('update:modelValue', $event.target.value)"
      @keydown="$emit('keydown', $event)"
      ref="input"
    />

    <span class="gl-span-form-error">{{ error_message }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>
  </div>
</template>











