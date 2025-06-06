<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>
    <p
      :id="field_name"
      class="mb-4 text-base text-gray-900 input_tr_show dark:text-white"
    >
      {{ model_value }}
    </p>
    <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
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

    <div
      ref="editor"
      class="CodeEditor custom-editor"
      :class="{
        'gl-input-form': error_message == '',
        'gl-input-form-invalid': error_message !== '',
      }"
    ></div>

    <span class="gl-span-form-error">{{ error_message }}</span>
    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">{{
      description
    }}</small>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  watch,
  defineProps,
  defineEmits,
  onUnmounted,
} from "vue";
import { EditorState, StateEffect } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/view";

import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

import { oneDark } from "@codemirror/theme-one-dark";

import { autocompletion } from "@codemirror/autocomplete";

// Define props
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "javascript",
  },
  theme: {
    type: String,
    default: "",
  },

  is_required: { type: Boolean, default: false },
  show: { type: Boolean, default: false },
  error_message: { type: String, default: "" },
  model_value: { type: [String, Number], default: null },
  type: { type: String, default: "text" },
  field_name: { type: String, default: "" },
  label_name: { type: String, default: "" },
  description: { type: String, default: "" },


  showLineNumbers: {
    type: Boolean,
    default: true,
  },
  highlightActiveLine: {
    type: Boolean,
    default: true,
  },

});

// Define emits
const emit = defineEmits(["update:modelValue", "change"]);

// Reference to the editor DOM element
const editor = ref(null);

// Reference to the EditorView instance
let editorView = null;

// Function to get language extension
const getLanguageExtension = (language) => {
  switch (language) {
    case "javascript":
      return javascript();

    // Add more languages here
    default:
      return [];
  }
};

// Function to get theme extension
const getThemeExtension = (theme) => {
  switch (theme) {
    case "one-dark":
      return oneDark;

    default:
     
      return document.body.classList.contains("dark") ?  oneDark : [];
  }
};


// Function to get lineNumbers extension based on showLineNumbers prop
const getLineNumbersExtension = (show) => {
  return show ? [lineNumbers()] : [];
};

// Function to get highlightActiveLineGutter extension based on highlightActiveLine prop
const getHighlightActiveLineExtension = (highlight) => {
  return highlight ? [highlightActiveLineGutter()] : [];
};



onMounted(() => {
  if (editor.value) {
    // Initialize EditorState
    const state = EditorState.create({
      doc: props.modelValue,
      extensions: [
        ...getLineNumbersExtension(props.showLineNumbers),
        ...getHighlightActiveLineExtension(props.highlightActiveLine),
        highlightActiveLineGutter(), //
        keymap.of(defaultKeymap),
        getLanguageExtension(props.language),
        ...getThemeExtension(props.theme),
        autocompletion(),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            const newValue = v.state.doc.toString();
            emit("update:modelValue", newValue);
            emit("change", newValue);
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    // Initialize EditorView
    editorView = new EditorView({
      state,
      parent: editor.value,
    });
  }
});

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    if (editorView) {
      const currentValue = editorView.state.doc.toString();
      if (newVal !== currentValue) {
        editorView.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: newVal,
          },
        });
      }
    }
  }
);

// Watch for language, theme, showLineNumbers, and highlightActiveLine changes
watch(
  () => [props.language, props.theme, props.showLineNumbers, props.highlightActiveLine],
  ([newLang, newTheme, newShowLineNumbers, newHighlightActiveLine]) => {
    if (editorView) {
      editorView.dispatch({
        effects: StateEffect.reconfigure.of([
          ...getLineNumbersExtension(newShowLineNumbers),
          ...getHighlightActiveLineExtension(newHighlightActiveLine),
          highlightActiveLineGutter(), // Ensure it's included if highlightActiveLine is true
          keymap.of([...defaultKeymap]),
          getLanguageExtension(newLang),
          ...getThemeExtension(newTheme),
          autocompletion(),
          EditorView.updateListener.of((v) => {
            if (v.docChanged) {
              const newValue = v.state.doc.toString();
              emit('update:modelValue', newValue);
              emit('change', newValue);
            }
          }),
          EditorView.lineWrapping,
        ]),
      });
    }
  }
);

// Cleanup on unmount
onUnmounted(() => {
  if (editorView) {
    editorView.destroy();
  }
});
</script>

<style>
.CodeEditor {
  height: 100%;
  padding: 0px;
}
</style>
