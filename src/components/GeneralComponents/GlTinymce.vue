<script setup>
import { onMounted, ref, computed, nextTick, watch, onBeforeUnmount } from "vue";
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
let editorInstance = null;
const darkMode = ref(false);

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
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
  'bold italic backcolor | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'removeformat | help',
    skin: false, // disable import of skins
    content_css: false, // disable import of css
    
    images_upload_url: '/uploadImages',
    setup(editor) {
      editorInstance = editor;
      editor.on('Change', () => {
        emit("update:modelValue", editor.getContent());
      });
      editor.on('init', () => {
        editor.setContent(props.modelValue);
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

watch(() => props.modelValue, (newValue) => {
  if (editorInstance && editorInstance.getContent() !== newValue) {
    editorInstance.setContent(newValue);
  }
});

const proxyValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>
    <p :id="field_name" class="mb-4 text-base text-gray-900 input_tr_show dark:text-white">{{ model_value }}</p>
    <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700">
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

    <textarea
      :name="field_name"
      :id="field_name"
      class="tiny"
      :class="{
        'gl-textarea-form mt-4': error_message == '',
        'gl-textarea-form-invalid mt-4': error_message !== '',
      }"
      :type="type"
      v-model="proxyValue"
      @keydown="$emit('keydown', $event)"
      ref="input"
      rows="4"
    ></textarea>

    <span class="gl-span-form-error">{{ error_message }}</span>
    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">{{ description }}</small>
  </div>
</template>
