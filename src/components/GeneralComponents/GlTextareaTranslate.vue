
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
  modelValue: {
    type: [String,Number],
    default: "",
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

const InputTranslateChanged = () => {


if(input_translate.value)
{

 emit('update:modelValueTranslate', input_translate.value.value);

}


};

onMounted(() => {


if (input.value !== null && input.value.hasAttribute('autofocus')) {
input.value.focus();
}

if(props.modelValue)
  {
     emit('update:modelValue', props.modelValue);
     input.value.value=props.modelValue;




  }

  if(props.modelValueTranslate)
  {
    // emit('update:modelValueTranslate', props.model_value_translate);
    // input_translate.value.value=props.model_value_translate;

   
    
     emit('update:modelValueTranslate', props.modelValueTranslate);
     input_translate.value.value=props.modelValueTranslate;



  }


  /*

  if(props.translatable && !props.modelValueTranslate)
 {
    axios

    .get(`/admin/get_field_translations`, {
      params: {
        model: props.translatable.model,
        row_id: props.translatable.row_id,
        field: props.translatable.field
    }



            })
    .then((response) => {



          input_translate.value.value=JSON.stringify(response.data);
          emit('update:modelValueTranslate', JSON.stringify(response.data));





    })
    .catch((error) => {
        // handle error
        console.log(error);
    });
   }

   */


   input.value.classList.add('gl-multilanguage');




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
      ref="input_translate"
      v-model="inputTranslateValue"


    />






    <p :id="field_name" class="mb-4 text-base text-gray-900 input_tr_show dark:text-white">{{ model_value }}</p>

    <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700">
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
      class="language-label js-language-label bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300"
    ></span>

    <input
      class="mb-4"
      type="hidden"
      data-i18n="true"
      :name="field_name + '_i18n'"
      :id="field_name + '_i18n'"
      @change="InputTranslateChanged"
      ref="input_translate"
    />

    <textarea
      class="mt-4 form-input-translation"
      :required="is_required"
      :name="field_name"
      :id="field_name"
      :class="{
        ' gl-textarea-form': error_message == '',
        ' gl-textarea-form-invalid': error_message !== '',
      }"
      :type="type"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown="$emit('keydown', $event)"
      ref="input"
      rows="4"
    >
   </textarea>

    <span class="gl-span-form-error">{{ error_message }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>
  </div>
</template>











