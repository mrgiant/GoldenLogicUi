<script setup>
import { computed, ref, watch } from "vue";
import GlDateTimePicker from "./GlDateTimePicker.vue";

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
        type: Object,
        default: () => ({ start: '', end: '' }),
    },

    field_name: {
        type: String,
        default: "",
    },

    label_name: {
        type: String,
        default: "",
    },

    // Optional per-picker labels shown above the start / end fields
    label_name_start: {
        type: String,
        default: "",
    },

    label_name_end: {
        type: String,
        default: "",
    },

    description: {
        type: String,
        default: "",
    },

    placeholder_start: {
        type: String,
        default: "",
    },

    placeholder_end: {
        type: String,
        default: "",
    },

    // Date format options
    date_format: {
        type: String,
        default: "YYYY-MM-DD",
    },

    // Step (in minutes) used when stepping the minute selector
    minute_step: {
        type: Number,
        default: 1,
    },

    // Min and max date constraints for start date
    min_date_start: {
        type: String,
        default: null,
    },

    max_date_start: {
        type: String,
        default: null,
    },

    // Min and max date constraints for end date
    min_date_end: {
        type: String,
        default: null,
    },

    max_date_end: {
        type: String,
        default: null,
    },

    // Disable specific days (0 = Sunday, 6 = Saturday)
    disabled_days: {
        type: Array,
        default: () => [],
    },

    // Disable specific dates
    disabled_dates: {
        type: Array,
        default: () => [],
    },

    // Locale for month/day names
    locale: {
        type: String,
        default: "en",
    },

    // Separator text between start and end
    separator: {
        type: String,
        default: "to",
    },

    // Container class
    container_class: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Whether per-field labels are shown above the start/end pickers. When they are,
// the separator needs a top offset so it lines up with the inputs (not the labels).
const hasFieldLabels = computed(
    () => !!(props.label_name_start || props.label_name_end)
);

const validationMessage = ref('');

const internalValue = ref({
    start: props.modelValue.start,
    end: props.modelValue.end,
});

// Watch for external modelValue changes
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue) {
            internalValue.value.start = newValue.start;
            internalValue.value.end = newValue.end;
        }
    },
    { immediate: true, deep: true }
);

// Convert a 12-hour value into a 24-hour value
const to24Hour = (hour12, meridiem) => {
    let h = hour12 % 12;
    if (meridiem === 'PM') h += 12;
    return h;
};

// Parse the date portion (year/month/day) according to the configured format
const parseDatePart = (datePart) => {
    if (!datePart) return null;

    let year, month, day;
    const parts = datePart.split(/[-/]/);

    if (parts.length !== 3) return null;

    switch (props.date_format) {
        case 'DD-MM-YYYY':
        case 'DD/MM/YYYY':
            day = parseInt(parts[0]);
            month = parseInt(parts[1]) - 1;
            year = parseInt(parts[2]);
            break;
        case 'MM-DD-YYYY':
        case 'MM/DD/YYYY':
            month = parseInt(parts[0]) - 1;
            day = parseInt(parts[1]);
            year = parseInt(parts[2]);
            break;
        case 'YYYY/MM/DD':
        case 'YYYY-MM-DD':
        default:
            year = parseInt(parts[0]);
            month = parseInt(parts[1]) - 1;
            day = parseInt(parts[2]);
            break;
    }

    return { year, month, day };
};

// Parse a full datetime string like "2026-06-06 03:45 PM" into a Date (time included)
const parseDateTime = (dateStr) => {
    if (!dateStr) return null;

    const trimmed = String(dateStr).trim();
    const firstSpace = trimmed.indexOf(' ');
    const datePart = firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace);
    const timePart = firstSpace === -1 ? "" : trimmed.slice(firstSpace + 1).trim();

    const ymd = parseDatePart(datePart);
    if (!ymd) {
        const native = new Date(trimmed);
        return isNaN(native.getTime()) ? null : native;
    }

    let hour24 = 0;
    let minute = 0;

    if (timePart) {
        const match = timePart.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (match) {
            const h = parseInt(match[1]);
            minute = parseInt(match[2]);
            const meridiem = match[3] ? match[3].toUpperCase() : null;
            hour24 = meridiem ? to24Hour(h, meridiem) : h;
        }
    }

    const { year, month, day } = ymd;
    const date = new Date(year, month, day, hour24, minute);
    return isNaN(date.getTime()) ? null : date;
};

// Computed min for end picker (should be at least the start datetime)
const computedMinDateEnd = computed(() => {
    if (internalValue.value.start) {
        return internalValue.value.start;
    }
    return props.min_date_end;
});

// Computed max for start picker (should be at most the end datetime)
const computedMaxDateStart = computed(() => {
    if (internalValue.value.end) {
        return internalValue.value.end;
    }
    return props.max_date_start;
});

// Validate that start is before end (full datetime comparison)
const validateDates = (startDate, endDate) => {
    if (startDate && endDate) {
        const start = parseDateTime(startDate);
        const end = parseDateTime(endDate);

        if (start && end && start > end) {
            validationMessage.value = 'Start date/time cannot be after end date/time.';
            return false;
        }
    }
    validationMessage.value = '';
    return true;
};

// Handle start change. We surface a validation message for an invalid range
// instead of destructively clearing the end the user already picked.
const handleStartChange = (newValue) => {
    internalValue.value.start = newValue;
    validateDates(internalValue.value.start, internalValue.value.end);
    emitValue();
};

// Handle end change. Likewise, never wipe the start the user already chose —
// just flag the range as invalid if start ends up after end.
const handleEndChange = (newValue) => {
    internalValue.value.end = newValue;
    validateDates(internalValue.value.start, internalValue.value.end);
    emitValue();
};

// Time portions extracted from each side, used to seed the opposite picker's
// default time so a same-day pick doesn't fall back to 12:00 AM (midnight).
const extractTimePart = (value) => {
    if (!value) return null;
    const i = value.indexOf(' ');
    return i === -1 ? null : value.slice(i + 1).trim();
};

const startTimePart = computed(() => extractTimePart(internalValue.value.start));
const endTimePart = computed(() => extractTimePart(internalValue.value.end));

// Emit the combined value
const emitValue = () => {
    const value = { start: internalValue.value.start, end: internalValue.value.end };
    emit('update:modelValue', value);
    emit('change', value);
};

// Computed error state for start picker
const startErrorMessage = computed(() => {
    // if (props.error_message) return props.error_message;
    return '';
});

// Computed error state for end picker
const endErrorMessage = computed(() => {
    return '';
});
</script>

<template>
    <!-- Show mode - display only -->
    <div class="md:col-span-2" :class="field_name" v-if="show">
        <label v-if="label_name" class="gl-label-form">{{ label_name }}</label>

        <p class="mt-1 text-gray-900 dark:text-white">
            {{ modelValue.start }} {{ separator }} {{ modelValue.end }}
        </p>

        <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <!-- Edit mode -->
    <div class="md:col-span-2" :class="{
        [field_name]: field_name && field_name !== '',
        [container_class]: container_class && container_class !== ''
    }" v-if="!show">
        <label
            v-if="label_name"
            :class="{
                'gl-label-form': error_message == '' && validationMessage == '',
                'gl-label-form-invalid': error_message !== '' || validationMessage !== '',
                required: is_required,
            }"
            :for="field_name"
        >{{ label_name }}</label>

        <div class="flex justify-between gap-2 flex-col md:flex-row items-center md:items-start">
            <!-- Start DateTime Picker -->
            <div class="w-full md:flex-1">
                <GlDateTimePicker
                    v-model="internalValue.start"
                    :field_name="field_name + '_start'"
                    :label_name="label_name_start"
                    :is_required="is_required"
                    :placeholder="placeholder_start"
                    :date_format="date_format"
                    :minute_step="minute_step"
                    :default_time="endTimePart"
                    :min_date="min_date_start"
                    :max_date="computedMaxDateStart"
                    :disabled_days="disabled_days"
                    :disabled_dates="disabled_dates"
                    :locale="locale"
                    :error_message="startErrorMessage"
                    @change="handleStartChange"
                />
            </div>

            <!-- Separator -->
            <span
                class="text-gray-500 dark:text-gray-400 font-medium shrink-0 py-2 md:py-0 md:flex md:items-center md:h-10"
                :class="{ 'md:mt-7': hasFieldLabels }"
            >
                {{ separator }}
            </span>

            <!-- End DateTime Picker -->
            <div class="w-full md:flex-1">
                <GlDateTimePicker
                    v-model="internalValue.end"
                    :field_name="field_name + '_end'"
                    :label_name="label_name_end"
                    :is_required="is_required"
                    :placeholder="placeholder_end"
                    :date_format="date_format"
                    :minute_step="minute_step"
                    :default_time="startTimePart"
                    :min_date="computedMinDateEnd"
                    :max_date="max_date_end"
                    :disabled_days="disabled_days"
                    :disabled_dates="disabled_dates"
                    :locale="locale"
                    :error_message="endErrorMessage"
                    @change="handleEndChange"
                />
            </div>
        </div>

        <!-- Validation/Error Messages -->
        <div class="text-center mt-1" v-if="validationMessage || error_message">
            <span class="gl-span-form-error">{{ error_message || validationMessage }}</span>
        </div>

        <!-- Description -->
        <small v-if="description" class="block mt-1 text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
    </div>
</template>
