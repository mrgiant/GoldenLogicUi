<script setup>
import { computed, ref, watch } from "vue";
import GlDatePicker from "./GlDatePicker.vue";

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

    description: {
        type: String,
        default: "",
    },

    placeholder_start: {
        type: String,
        default: "Start date",
    },

    placeholder_end: {
        type: String,
        default: "End date",
    },

    // Date format options
    date_format: {
        type: String,
        default: "YYYY-MM-DD",
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

    // Separator text between start and end date
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

// Parse date string to Date object for comparison
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    
    let year, month, day;
    const parts = dateStr.split(/[-/]/);
    
    if (parts.length !== 3) return new Date(dateStr);
    
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
    
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
};

// Computed min date for end picker (should be at least the start date)
const computedMinDateEnd = computed(() => {
    if (internalValue.value.start) {
        return internalValue.value.start;
    }
    return props.min_date_end;
});

// Computed max date for start picker (should be at most the end date)
const computedMaxDateStart = computed(() => {
    if (internalValue.value.end) {
        return internalValue.value.end;
    }
    return props.max_date_start;
});

// Validate dates and check if start is before end
const validateDates = (startDate, endDate) => {
    if (startDate && endDate) {
        const start = parseDate(startDate);
        const end = parseDate(endDate);
        
        if (start && end && start > end) {
            validationMessage.value = 'Start date cannot be after end date.';
            return false;
        }
    }
    validationMessage.value = '';
    return true;
};

// Handle start date change
const handleStartChange = (newValue) => {
    internalValue.value.start = newValue;
    
    // If end date exists and is before new start date, clear end date
    if (internalValue.value.end) {
        const start = parseDate(newValue);
        const end = parseDate(internalValue.value.end);
        
        if (start && end && start > end) {
            internalValue.value.end = '';
        }
    }
    
    validateDates(internalValue.value.start, internalValue.value.end);
    emitValue();
};

// Handle end date change
const handleEndChange = (newValue) => {
    internalValue.value.end = newValue;
    
    // If start date exists and is after new end date, clear start date
    if (internalValue.value.start) {
        const start = parseDate(internalValue.value.start);
        const end = parseDate(newValue);
        
        if (start && end && start > end) {
            internalValue.value.start = '';
        }
    }
    
    validateDates(internalValue.value.start, internalValue.value.end);
    emitValue();
};

// Emit the combined value
const emitValue = () => {
    const value = { start: internalValue.value.start, end: internalValue.value.end };
    emit('update:modelValue', value);
    emit('change', value);
};

// Computed error state for start picker
const startErrorMessage = computed(() => {
    if (props.error_message) return props.error_message;
    return '';
});

// Computed error state for end picker
const endErrorMessage = computed(() => {
    return '';
});




</script>

<template>
    <!-- Show mode - display only -->
    <div :class="field_name" v-if="show">
        <label v-if="label_name" class="gl-label-form">{{ label_name }}</label>

        <p class="mt-1 text-gray-900 dark:text-white">
            {{ modelValue.start }} {{ separator }} {{ modelValue.end }}
        </p>

        <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <!-- Edit mode -->
    <div :class="{
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

        <div class="flex justify-between gap-2 flex-col md:flex-row items-center">
            <!-- Start Date Picker -->
            <div class="w-full md:flex-1">
                <GlDatePicker
                    v-model="internalValue.start"
                    :field_name="field_name + '_start'"
                    :is_required="is_required"
                    :placeholder="placeholder_start"
                    :date_format="date_format"
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
            <span class="text-gray-500 dark:text-gray-400 font-medium shrink-0 py-2 md:py-0">
                {{ separator }}
            </span>

            <!-- End Date Picker -->
            <div class="w-full md:flex-1">
                <GlDatePicker
                    v-model="internalValue.end"
                    :field_name="field_name + '_end'"
                    :is_required="is_required"
                    :placeholder="placeholder_end"
                    :date_format="date_format"
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
