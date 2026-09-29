
<script setup>
import { ref } from "vue";
import { glLocale } from "../../localeStore";
import { useTranslations } from "../../useTranslations";

/**
 * A translatable text field, self-contained.
 *
 * The translations live here, in component state, keyed by locale. The visible
 * input is a plain binding onto the entry for the language the shared selector
 * has chosen — switching language is a re-render, not a DOM walk.
 *
 * The previous implementation delegated all of this to a plugin that scanned
 * the document for hidden inputs and mirrored values into dataset attributes.
 * Because it held DOM nodes, any field that was unmounted and remounted — a
 * tab rendered behind v-if, a repeater row — detached from it silently, and
 * text was lost. Holding the state in Vue makes that whole class of failure
 * impossible: the DOM can come and go, the object stays.
 *
 * The contract is unchanged. `modelValueTranslate` still carries the JSON the
 * backend's prepareTranslations() parses ({"en":"...","ar":"..."}), a hidden
 * input still renders it under `field_name + '_i18n'` for native form posts,
 * and `modelValue` still tracks what is typed.
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
  // What the plain v-model sees is the text on screen, exactly as before; the
  // backend derives the canonical default-locale value from the JSON.
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

    <!-- gl-multilanguage kept for the consuming apps' loading logic, which
         counts elements carrying it before revealing a modal. -->
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

    <!-- The badge naming the language being typed. Rendered from the store, so
         it can never go stale or blank however often the field remounts. -->
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

    <input
      :required="is_required"
      :name="field_name"
      :id="field_name"
      class="mt-2 form-input-translation gl-multilanguage"
      :class="{
        ' gl-input-form': error_message == '',
        ' gl-input-form-invalid': error_message !== '',
      }"
      :type="type"
      :value="currentText"
      @input="onInput"
      @keydown="$emit('keydown', $event)"
      ref="input"
    />

    <span class="gl-span-form-error">{{ error_message }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>
  </div>
</template>
