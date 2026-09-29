<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>
    <p
      :id="field_name"
      class="mb-4 text-base text-gray-900 gl-multilanguage input_tr_show dark:text-white"
    >
      {{ currentText }}
    </p>

    <input
      type="hidden"
      :name="field_name + '_i18n'"
      :id="field_name + '_i18n'"
      :value="asJson()"
    />
    <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
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
    >{{ glLocale.current }}</span>

    <input
      class="mb-4"
      type="hidden"
      :name="field_name + '_i18n'"
      :id="field_name + '_i18n'"
      :value="asJson()"
    />

    <div
      ref="editor"
      class="CodeEditor custom-editor form-input-translation gl-multilanguage"
      :class="{
        'gl-input-form': error_message == '',
        'gl-input-form-invalid ': error_message !== '',
      }"

       :name="field_name"
      :id="field_name"
    ></div>

    <span class="gl-span-form-error">{{ error_message }}</span>
    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">{{
      description
    }}</small>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  watch,
  defineProps,
  defineEmits,
  onUnmounted,
} from "vue";
import { glLocale } from "../../localeStore";
import { useTranslations } from "../../useTranslations";
import { EditorState, StateEffect } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/view";

import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import {html} from "@codemirror/lang-html"

import { oneDark } from "@codemirror/theme-one-dark";

import { autocompletion } from "@codemirror/autocomplete";

/**
 * A translatable code field.
 *
 * Same design as GlTextTranslate — per-locale text in component state, JSON
 * contract unchanged — with CodeMirror bridged the way GlTinymceTranslate
 * bridges TinyMCE: the editor's edits land in labels[current locale] as they
 * happen, and switching locale rewrites the editor's document. `labels` is the
 * single source of truth; the editor is a view of one language at a time.
 */
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


  modelValueTranslate: {
    type: [String,Object],
    default: "",
  },


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
const emit = defineEmits(["update:modelValue", "update:modelValueTranslate", "change"]);

// Reference to the editor DOM element
const editor = ref(null);

// Reference to the EditorView instance
let editorView = null;

/** True while this component rewrites the document, so the resulting update
 * event is not read back as the user typing. */
let settingContent = false;

const showEditorCurrentLocale = () => {
  if (!editorView) {
    return;
  }

  const inEditor = editorView.state.doc.toString();

  if (inEditor === currentText.value) {
    return;
  }

  settingContent = true;
  editorView.dispatch({
    changes: { from: 0, to: inEditor.length, insert: currentText.value },
  });
  settingContent = false;
};

const { asJson, currentText, setCurrent } = useTranslations(
  props,
  emit,
  showEditorCurrentLocale
);

const captureFromEditor = (content) => {
  if (settingContent || !glLocale.current) {
    return;
  }

  if (currentText.value !== content) {
    setCurrent(content);
    emit("change", content);
  }
};

/** The language switch: what used to be the DOM plugin's whole job. */
watch(
  () => glLocale.current,
  () => {
    showEditorCurrentLocale();
  }
);

// Function to get language extension
const getLanguageExtension = (language) => {
  switch (language) {
    case "javascript":
      return javascript();

    case "html":
      return html();



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

const buildExtensions = (language, theme, showLineNumbersOpt, highlightActiveLineOpt) => [
  ...getLineNumbersExtension(showLineNumbersOpt),
  ...getHighlightActiveLineExtension(highlightActiveLineOpt),
  highlightActiveLineGutter(),
  keymap.of(defaultKeymap),
  getLanguageExtension(language),
  ...getThemeExtension(theme),
  autocompletion(),
  EditorView.updateListener.of((v) => {
    if (v.docChanged) {
      captureFromEditor(v.state.doc.toString());
    }
  }),
  EditorView.lineWrapping,
];

onMounted(() => {

  if (editor.value) {
    // Initialize EditorState
    const state = EditorState.create({
      doc: currentText.value,
      extensions: buildExtensions(
        props.language,
        props.theme,
        props.showLineNumbers,
        props.highlightActiveLine
      ),
    });

    // Initialize EditorView
    editorView = new EditorView({
      state,
      parent: editor.value,
    });
  }

});

// Watch for language, theme, showLineNumbers, and highlightActiveLine changes
watch(
  () => [props.language, props.theme, props.showLineNumbers, props.highlightActiveLine],
  ([newLang, newTheme, newShowLineNumbers, newHighlightActiveLine]) => {
    if (editorView) {
      editorView.dispatch({
        effects: StateEffect.reconfigure.of(
          buildExtensions(newLang, newTheme, newShowLineNumbers, newHighlightActiveLine)
        ),
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
