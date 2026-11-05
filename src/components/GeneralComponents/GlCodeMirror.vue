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
      v-if="label_name"
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
  defineExpose,
  onUnmounted,
} from "vue";
import { EditorState, StateEffect, Prec } from "@codemirror/state";
import { EditorView, keymap, placeholder as placeholderExtension } from "@codemirror/view";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/view";

import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { sql, MySQL, PostgreSQL, StandardSQL } from "@codemirror/lang-sql";

import { oneDark } from "@codemirror/theme-one-dark";

import { autocompletion } from "@codemirror/autocomplete";

// Define props
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  // "javascript" or "sql"; anything else is plain text.
  language: {
    type: String,
    default: "javascript",
  },
  // For SQL: "mysql" or "postgresql" picks the keywords and quoting; empty is standard SQL.
  dialect: {
    type: String,
    default: "",
  },
  // For SQL completion: { tableName: ["column", ...] }.
  sqlSchema: {
    type: Object,
    default: null,
  },
  theme: {
    type: String,
    default: "",
  },
  // A CSS height such as "320px"; empty lets the editor grow with its content.
  height: {
    type: String,
    default: "",
  },
  placeholder: {
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

// Define emits: "run" fires on Ctrl/Cmd+Enter.
const emit = defineEmits(["update:modelValue", "change", "run"]);

// Reference to the editor DOM element
const editor = ref(null);

// Reference to the EditorView instance
let editorView = null;

const sqlDialect = (dialect) => {
  switch ((dialect || "").toLowerCase()) {
    case "mysql":
    case "mariadb":
      return MySQL;
    case "postgresql":
    case "postgres":
    case "pgsql":
      return PostgreSQL;
    default:
      return StandardSQL;
  }
};

// Function to get language extension
const getLanguageExtension = (language) => {
  switch (language) {
    case "javascript":
      return javascript();

    case "sql":
      return sql({
        dialect: sqlDialect(props.dialect),
        schema: props.sqlSchema || undefined,
      });

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

const getHeightExtension = (height) => {
  if (!height) {
    return [];
  }

  return [
    EditorView.theme({
      "&": { height },
      ".cm-scroller": { overflow: "auto" },
    }),
  ];
};

const getPlaceholderExtension = (text) => {
  return text ? [placeholderExtension(text)] : [];
};

// Ctrl/Cmd+Enter runs; it sits above the default keymap so Enter's binding does not swallow it.
const runKeymap = Prec.highest(
  keymap.of([
    {
      key: "Mod-Enter",
      run: () => {
        emit("run");
        return true;
      },
    },
  ])
);

// One list of extensions for both the first state and every reconfigure.
const buildExtensions = () => [
  ...getLineNumbersExtension(props.showLineNumbers),
  ...getHighlightActiveLineExtension(props.highlightActiveLine),
  highlightActiveLineGutter(),
  runKeymap,
  keymap.of(defaultKeymap),
  getLanguageExtension(props.language),
  ...getThemeExtension(props.theme),
  ...getHeightExtension(props.height),
  ...getPlaceholderExtension(props.placeholder),
  autocompletion(),
  EditorView.updateListener.of((v) => {
    if (v.docChanged) {
      const newValue = v.state.doc.toString();
      emit("update:modelValue", newValue);
      emit("change", newValue);
    }
  }),
  EditorView.lineWrapping,
];



onMounted(() => {
  if (editor.value) {
    // Initialize EditorState
    const state = EditorState.create({
      doc: props.modelValue,
      extensions: buildExtensions(),
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

// Rebuild the extensions when any option changes.
watch(
  () => [props.language, props.dialect, props.sqlSchema, props.theme, props.showLineNumbers, props.highlightActiveLine, props.height, props.placeholder],
  () => {
    if (editorView) {
      editorView.dispatch({
        effects: StateEffect.reconfigure.of(buildExtensions()),
      });
    }
  }
);

const focus = () => {
  editorView?.focus();
};

defineExpose({ focus });

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
