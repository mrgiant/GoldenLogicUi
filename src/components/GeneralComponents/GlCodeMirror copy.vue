<script setup>
import { ref, watch, onMounted, onBeforeUnmount,computed,nextTick } from 'vue'

import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from '@codemirror/basic-setup';


const props = defineProps({
  is_required: { type: Boolean, default: false },
  show: { type: Boolean, default: false },
  error_message: { type: String, default: "" },
  model_value: { type: [String, Number], default: null },
  modelValue: { type: [String, Number], default: "" },
  type: { type: String, default: "text" },
  field_name: { type: String, default: "" },
  label_name: { type: String, default: "" },
  description: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "keydown"]);
const input = ref(null);
const editorRef = ref(null)
let editorView = null

const initCodeMirror = async () => {
  await nextTick();

  if (editorView) {
    editorView.destroy()
    editorView = null
  }


  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const content = update.state.doc.toString();
          emit('update:modelValue', content); // Emit the updated content
        }
      }),
    ],
  });

  editorView = new EditorView({
    state,
    parent: editorRef.value, // Attach the editor to the DOM element
  });

 
};

onMounted(initCodeMirror);

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
});



watch(
  () => props.modelValue,
  (newVal) => {
    if (!editorView) return

    const currentValue = editorView.state.doc.toString()
    if (newVal !== currentValue) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: newVal,
        },
      })
    }
  }
)



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
    >{{ label_name }}</label>



    <div ref="editorRef" class="editor-container" />

   

    <span class="gl-span-form-error">{{ error_message }}</span>
    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">{{ description }}</small>
  </div>
</template>
