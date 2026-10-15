<script setup>
import { computed, ref, watch } from "vue";
import GlDropdown from "./GlDropdown.vue";
import { PHONE_CODE_DEFAULTS, PHONE_COUNTRIES, PHONE_PREFERRED } from "./phoneCountries.js";

/**
 * A mobile number with its country code: a searchable country picker in
 * front of a digits-only number.
 *
 *   <gl-phone-input v-model="form.MobileNO" v-model:country_code="form.mobile_country_code"
 *       field_name="MobileNO" label_name="Mobile No." :is_required="true"
 *       :error_message="form.errors.get('MobileNO')" />
 *
 * The number is kept without its code (91234567); the code goes to its own
 * v-model (+968), and the country to v-model:country (OM) if wanted, since
 * some codes are shared (+1 is the US, Canada and the Caribbean). Pasting a
 * full international number (+968 9123 4567 or 00968...) picks the country
 * and keeps the rest; a leading trunk 0 (01012345678 in Egypt) is dropped
 * when the country's length says so. Numbers are always laid out left to
 * right, also on Arabic pages.
 */

const props = defineProps({
  /** The number without its country code, digits only. */
  modelValue: { type: [String, Number], default: "" },
  /** The dialling code, such as +968. Bind with v-model:country_code. */
  country_code: { type: String, default: "+968" },
  /** The country's ISO code, such as OM, where a code is shared. Optional. */
  country: { type: String, default: "" },
  /**
   * The countries offered: [{ code: 'OM', dial: '+968', name: 'Oman', length: 8 }].
   * length is the digits after the code, used to warn on a short or long
   * number; leave it out where numbers vary. Defaults to every country.
   */
  countries: { type: Array, default: () => PHONE_COUNTRIES },
  /** ISO codes listed first; the rest follow alphabetically. */
  preferred: { type: Array, default: () => PHONE_PREFERRED },
  /** Show the code as fixed text instead of a picker. */
  lock_country: { type: Boolean, default: false },

  field_name: { type: String, default: "" },
  label_name: { type: String, default: "" },
  is_required: { type: Boolean, default: false },
  show: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error_message: { type: String, default: "" },
  description: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  /** Shown when the length is off. :country and :length are filled in. */
  length_message: { type: String, default: ":country numbers have :length digits." },
  search_placeholder: { type: String, default: "Search country or code" },
});

const emit = defineEmits(["update:modelValue", "update:country_code", "update:country", "change", "blur"]);

const input = ref(null);
const touched = ref(false);

/** An option's key: its ISO code, or the code itself for one not on the list. */
const keyOf = (c) => c.code || c.dial;

/** The list, plus the bound code if no country has it, so it still shows. */
const options = computed(() => {
  const list = props.countries;
  if (!props.country_code || list.some((c) => c.dial === props.country_code)) {
    return list;
  }
  return [...list, { code: "", dial: props.country_code, name: props.country_code }];
});

const preferredOptions = computed(() =>
  props.preferred.map((iso) => options.value.find((c) => c.code === iso)).filter(Boolean)
);

/** Preferred countries first, then the rest by name: one flat list. */
const orderedOptions = computed(() => [
  ...preferredOptions.value,
  ...options.value
    .filter((c) => !props.preferred.includes(c.code))
    .sort((a, b) => a.name.localeCompare(b.name)),
]);

/** What the picker shows (the code and ISO) and what it searches by (also the name). */
const dropdownOptions = computed(() =>
  orderedOptions.value.map((c) => ({
    id: keyOf(c),
    name: c.code ? `${c.dial} ${c.code}` : c.dial,
    hint: c.code ? c.name : "",
    keywords: `${c.name} ${c.dial} ${c.code}`,
  }))
);

/**
 * Which country a code means: the one asked for, else a preferred one, else
 * the usual one for a shared code, else the first that has it.
 */
function countryFor(dial, iso = "") {
  const withCode = options.value.filter((c) => c.dial === dial);
  return (
    withCode.find((c) => iso && c.code === iso) ||
    preferredOptions.value.find((c) => c.dial === dial) ||
    withCode.find((c) => c.code === PHONE_CODE_DEFAULTS[dial]) ||
    withCode[0] ||
    null
  );
}

const selected = ref(keyOf(countryFor(props.country_code, props.country) || { dial: props.country_code }));

// Set from outside: follow it unless the chosen country already has that code.
watch(
  () => [props.country_code, props.country],
  ([dial, iso]) => {
    const current = options.value.find((c) => keyOf(c) === selected.value);
    if (current && current.dial === dial && (!iso || current.code === iso)) {
      return;
    }
    const match = countryFor(dial, iso);
    selected.value = match ? keyOf(match) : dial;
  }
);

const country = computed(() => options.value.find((c) => keyOf(c) === selected.value) || null);

const number = computed(() => String(props.modelValue ?? ""));

const lengthHint = computed(() => {
  const expected = country.value?.length;
  if (!touched.value || !expected || number.value === "" || number.value.length === expected) {
    return "";
  }
  return props.length_message
    .replace(":country", country.value.name)
    .replace(":length", String(expected));
});

const shownError = computed(() => props.error_message || lengthHint.value);

const digitsOnly = (value) => String(value ?? "").replace(/\D/g, "");

const digitsOf = (dial) => dial.replace(/\D/g, "");

/** The code that starts these digits, longest first (so +971 before +97). */
function codeStarting(digits) {
  const dials = [...new Set(options.value.map((c) => c.dial).filter(Boolean))];
  return dials
    .sort((a, b) => digitsOf(b).length - digitsOf(a).length)
    .find((dial) => digits.startsWith(digitsOf(dial)));
}

function choose(target) {
  selected.value = keyOf(target);
  if (target.dial !== props.country_code) {
    emit("update:country_code", target.dial);
  }
  if (target.code && target.code !== props.country) {
    emit("update:country", target.code);
  }
}

function emitChange(value) {
  const dial = country.value?.dial || props.country_code;
  emit("change", { country_code: dial, country: country.value?.code || "", number: value, full: value ? `${dial}${value}` : "" });
}

function setNumber(raw) {
  const text = String(raw ?? "").trim();
  let digits = digitsOnly(text);

  // A full international number: take the country from it.
  if (!props.lock_country && (text.startsWith("+") || text.startsWith("00"))) {
    const international = text.startsWith("00") ? digits.slice(2) : digits;
    const dial = codeStarting(international);
    if (dial) {
      // Keep the chosen country if it already has this code.
      choose(country.value?.dial === dial ? country.value : countryFor(dial));
      digits = international.slice(digitsOf(dial).length);
    }
  }

  // A local trunk prefix: 0 + the number.
  const expected = country.value?.length;
  if (expected && digits.length === expected + 1 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  emit("update:modelValue", digits);
  emitChange(digits);

  // Keep the field showing exactly what is stored.
  if (input.value && input.value.value !== digits) {
    input.value.value = digits;
  }
}

/** The picker's choice: its option id is the country's key. */
function onPicked(option) {
  const target = option?.id ? options.value.find((c) => keyOf(c) === option.id) : null;
  if (target) {
    choose(target);
    emitChange(number.value);
  }
}

function onBlur(event) {
  touched.value = true;
  emit("blur", event);
}

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
  <div v-if="show" :class="field_name">
    <label v-if="label_name" class="gl-label-form">{{ label_name }}</label>
    <p class="mt-1 text-gray-900 dark:text-white tabular-nums" dir="ltr">
      <template v-if="number">{{ country?.dial || country_code }} {{ number }}</template>
    </p>
    <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
  </div>

  <div v-else :class="field_name">
    <label
      v-if="label_name"
      :for="field_name"
      :class="{
        'gl-label-form': !shownError,
        'gl-label-form-invalid': shownError,
        required: is_required,
      }"
    >{{ label_name }}</label>

    <div class="flex" dir="ltr">
      <span
        v-if="lock_country"
        class="h-10 inline-flex shrink-0 items-center rounded-s-lg border border-e-0 border-gray-200 bg-gray-100 px-3 text-sm font-medium text-gray-700 tabular-nums dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
      >{{ country?.dial || country_code }}</span>

      <gl-dropdown
        v-else
        class="w-32 shrink-0"
        :field_name="`${field_name}_country`"
        :options="dropdownOptions"
        :modelValue="selected"
        :has_cancel="false"
        :disabled="disabled"
        :search_input_placeholder="search_placeholder"
        input_class="rounded-e-none! border-e-0! bg-gray-100! dark:bg-gray-700! font-medium tabular-nums"
        options_class="min-w-72"
        @selectionChanged="onPicked"
      />

      <input
        ref="input"
        type="tel"
        inputmode="numeric"
        autocomplete="tel-national"
        :id="field_name"
        :name="field_name"
        :value="number"
        :placeholder="placeholder || (country?.length ? '0'.repeat(country.length) : '')"
        maxlength="24"
        :required="is_required"
        :disabled="disabled"
        :aria-invalid="shownError ? 'true' : 'false'"
        class="min-w-0 rounded-s-none! tabular-nums"
        :class="{
          'gl-input-form': !shownError,
          'gl-input-form-invalid': shownError,
          'opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-700': disabled,
        }"
        @input="setNumber($event.target.value)"
        @blur="onBlur"
      />
    </div>

    <span class="gl-span-form-error">{{ shownError }}</span>

    <small v-if="description" class="block mt-1 text-sm font-normal leading-5 text-gray-500">{{ description }}</small>
  </div>
</template>
