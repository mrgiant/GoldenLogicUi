
<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { glLocale } from "../../localeStore";
import { useTranslations } from "../../useTranslations";
import tinymce from 'tinymce';
import 'tinymce/icons/default/icons';
import 'tinymce/themes/silver/theme';
import 'tinymce/models/dom/model';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/plugins/code/plugin';
import 'tinymce/plugins/wordcount/plugin';
import 'tinymce/plugins/fullscreen/plugin';
import 'tinymce/plugins/preview/plugin';
import 'tinymce/plugins/advlist/plugin';
import 'tinymce/plugins/searchreplace/plugin';
import 'tinymce/plugins/anchor/plugin';
import 'tinymce/plugins/autolink/plugin';
import 'tinymce/plugins/charmap/plugin';
import 'tinymce/plugins/insertdatetime/plugin';
import 'tinymce/plugins/visualblocks/plugin';
import 'tinymce/plugins/help/plugin';

/**
 * A translatable rich-text field.
 *
 * Same design as GlTextTranslate — the per-locale content lives in component
 * state, and the JSON contract with the backend is unchanged — with one
 * addition: TinyMCE owns its own document, so the state is bridged into it
 * explicitly. The editor's edits land in labels[current locale] as they
 * happen, and switching locale writes the other language's content into the
 * editor. The single source of truth is `labels`; the editor is a view.
 */
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
    default: null,
  },

  modelValue: {
    type: [String, Number],
    default: "",
  },

  model_value_translate: {
    type: [String, Object],
    default: null,
  },

  modelValueTranslate: {
    type: [String, Object],
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

const emit = defineEmits(["update:modelValue", "update:modelValueTranslate", "keydown"]);

const input = ref(null);
let editorInstance = null;

/** True while this component is writing into the editor, so the editor's
 * resulting change events are not read back as the user typing. */
let settingContent = false;

const showEditorCurrentLocale = () => {
  if (!editorInstance || !editorInstance.initialized) {
    return;
  }

  if (editorInstance.getContent() === currentText.value) {
    return;
  }

  settingContent = true;
  editorInstance.setContent(currentText.value);
  settingContent = false;
};

const { asJson, currentText, setCurrent } = useTranslations(
  props,
  emit,
  showEditorCurrentLocale
);

const captureFromEditor = () => {
  if (!editorInstance || settingContent || !glLocale.current) {
    return;
  }

  const content = editorInstance.getContent();

  if (currentText.value !== content) {
    setCurrent(content);
  }
};

/** The language switch: what used to be the DOM plugin's whole job. */
watch(
  () => glLocale.current,
  () => {
    showEditorCurrentLocale();
  }
);

const initTinyMCE = async () => {
  await nextTick();

  if (editorInstance) {
    editorInstance.destroy();
    editorInstance = null;
  }

  tinymce.init({
    selector: '#' + props.field_name,
    height: 300,
    plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
  'bold italic backcolor | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'removeformat | help',
    skin: false, // disable import of skins
    content_css: false, // disable import of css

    images_upload_url: '/uploadImages',
    // Keep uploaded/inserted URLs root-relative. TinyMCE otherwise rewrites
    // them relative to the page hosting the editor, so an image uploaded from
    // an admin route is stored as ../storage/... and breaks elsewhere.
    relative_urls: false,
    remove_script_host: true,
    setup(editor) {
      editorInstance = editor;

      // Change alone misses plain typing until focus leaves the editor; the
      // old design papered over that by re-reading the editor at save time.
      // With the state captured as it happens, nothing is left to collect.
      editor.on('input change undo redo keyup', captureFromEditor);

      editor.on('init', () => {
        showEditorCurrentLocale();
      });
    },
  });
};

onMounted(initTinyMCE);

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy();
    editorInstance = null;
  }
});

const proxyValue = computed({
  get() {
    return currentText.value;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>

    <input
      type="hidden"
      :name="field_name + '_i18n'"
      :id="field_name + '_i18n'"
      :value="asJson()"
    />

    <p :id="field_name" class="mb-4 text-base text-gray-900 gl-multilanguage input_tr_show dark:text-white">{{ proxyValue }}</p>

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
    >{{ glLocale.current }}</span>

    <input
      class="mb-4"
      type="hidden"
      :name="field_name + '_i18n'"
      :id="field_name + '_i18n'"
      :value="asJson()"
    />

    <textarea

      :name="field_name"
      :id="field_name"
      class="mt-4 tiny form-input-translation gl-multilanguage"
      :class="{
        ' gl-textarea-form': error_message == '',
        ' gl-textarea-form-invalid': error_message !== '',
      }"
      :type="type"
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
