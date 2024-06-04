<template>



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




    <div class="editor-container" ref="editorContainer"></div>


    <span class="gl-span-form-error">{{ error_message }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>



    </div>


    <!--

      to use it

   <MonacoEditor
      v-model="code"
      language="typescript"
      theme="vs-light"
      :onChange="handleEditorChange"
    />



     -->






</template>

<script setup>
import { onMounted,onBeforeUnmount, ref, watch } from 'vue';
import * as monaco from 'monaco-editor';

  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
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

  error_message: {
    type: String,
    default: "",
  },


  is_required: {
    type: Boolean,
    default: false,
  },





    language: {
      type: String,
      default: 'javascript',
    },
    theme: {
      type: String,
      default: 'vs-dark',
    },
    onChange: {
      type: Function,
      default: null,
    },







  });
 
    const editorContainer = ref(null);
    const editorInstance = ref(null);

    const emitChange = () => {
      if (editorInstance.value) {
        const value = editorInstance.value.getValue();
        emit('update:modelValue', value);
        if (props.onChange) {
          props.onChange(value);
        }
      }
    };

    onMounted(() => {
      editorInstance.value = monaco.editor.create(editorContainer.value, {
        value: props.modelValue,
        language: props.language,
        theme: props.theme,
      });

      editorInstance.value.onDidChangeModelContent(() => {
        emitChange();
      });
    });

    watch(() => props.modelValue, (newValue) => {
      if (editorInstance.value && newValue !== editorInstance.value.getValue()) {
        editorInstance.value.setValue(newValue);
      }
    });

    onBeforeUnmount(() => {
    if (editorInstance.value) {
      editorInstance.value.dispose();
    }
  });

 

</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 600px;
}
</style>
