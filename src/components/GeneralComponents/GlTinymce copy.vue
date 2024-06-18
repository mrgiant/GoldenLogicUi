
<script setup>
import { onMounted, ref,computed,nextTick } from "vue";
// Import TinyMCE
import tinymce from 'tinymce/tinymce';

// A theme is also required
import 'tinymce/themes/silver/theme';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/codesample';

import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';


import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/media';


import 'tinymce/plugins/searchreplace';

import 'tinymce/plugins/template';

import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autoresize';

import 'tinymce/plugins/code';

import 'tinymce/plugins/directionality';

import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';

import 'tinymce/plugins/lists';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/save';

import 'tinymce/plugins/table';


import 'tinymce/plugins/visualchars';



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


const emit = defineEmits(["update:modelValue","keydown"]);

const input = ref(null);

const initTinyMCE = async () => {
  await nextTick();
  tinymce.init({
    selector: '#' + props.field_name,
    width: '100%',
    height: 300,
    setup(editor) {
      editor.on('Change', () => {
        emit("update:modelValue", editor.getContent());
      });
    },
  });

 
};

onMounted(() => {





  initTinyMCE();


    console.log('tinymce ',props.modelValue);


    if (input.value && input.value.getTinymce) {
        const tinymceInstance = input.value.getTinymce();
       

        console.log('tinymceInstance ',tinymceInstance.getContent());

    }

    console.log('tinymce ',input.value.getTinymce());






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

      :name="field_name"
      :id="field_name"
      class="tiny"
      :class="{
        ' gl-textarea-form   mt-4 ': error_message == '',
        ' gl-textarea-form-invalid   mt-4 ': error_message !== '',
      }"
      :type="type"
      v-model="proxyValue"
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













