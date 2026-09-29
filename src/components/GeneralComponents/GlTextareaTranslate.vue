
<script setup>
import { ref } from "vue";
import { glLocale } from "../../localeStore";
import { useTranslations } from "../../useTranslations";

/**
 * A translatable textarea. Same design as GlTextTranslate: the per-locale text
 * lives in component state, the visible control renders the entry for the
 * language the shared selector has chosen, and the JSON contract with the
 * backend is unchanged. See GlTextTranslate for the full rationale.
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

  modelValue: {
    type: [String, Number],
    default: "",
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

const { asJson, currentText, setCurrent } = useTranslations(props, emit);

const onInput = (event) => {
  setCurrent(event.target.value);
};

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

    <p :id="field_name" class="mb-4 text-base text-gray-900 gl-multilanguage input_tr_show dark:text-white">{{ currentText }}</p>

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
      class="mt-4 form-input-translation gl-multilanguage"
      :required="is_required"
      :name="field_name"
      :id="field_name"
      :class="{
        ' gl-textarea-form': error_message == '',
        ' gl-textarea-form-invalid': error_message !== '',
      }"
      :value="currentText"
      @input="onInput"
      @keydown="$emit('keydown', $event)"
      ref="input"
      rows="4"
    ></textarea>

    <span class="gl-span-form-error">{{ error_message }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>
  </div>
</template>
