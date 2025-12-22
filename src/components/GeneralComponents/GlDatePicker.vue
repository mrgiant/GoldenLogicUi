<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

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
        type: [String, Date],
        default: "",
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

    placeholder: {
        type: String,
        default: "Select date",
    },

    input_class: {
        type: String,
        default: "",
    },

    container_class: {
        type: String,
        default: "",
    },

    // Date format options
    date_format: {
        type: String,
        default: "YYYY-MM-DD", // Options: YYYY-MM-DD, DD-MM-YYYY, MM-DD-YYYY, DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD
    },

    // Min and max date constraints
    // Accepts: "YYYY-MM-DD" or relative: "+3m", "-1y", "+7d", "today"
    min_date: {
        type: String,
        default: null,
    },

    // Accepts: "YYYY-MM-DD" or relative: "+3m", "-1y", "+7d", "today"
    max_date: {
        type: String,
        default: null,
    },

    // Disable specific days (0 = Sunday, 6 = Saturday)
    disabled_days: {
        type: Array,
        default: () => [],
    },

    // Locale for month/day names
    locale: {
        type: String,
        default: "en",
    },

    inputGroupType: {
        type: String,
        default: "",
    },

    inputGroupText: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue", "change", "blur-sm"]);

const input = ref(null);
const datepickerContainer = ref(null);
const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// Parse relative date string like "+3m", "-1y", "+7d", "today"
const parseRelativeDate = (dateStr) => {
    if (!dateStr) return null;
    
    // Handle "today"
    if (dateStr.toLowerCase() === 'today') {
        return new Date();
    }
    
    // Handle relative format: +3m, -1y, +7d
    const match = dateStr.match(/^([+-]?)(\d+)([dmy])$/i);
    if (match) {
        const sign = match[1] === '-' ? -1 : 1;
        const value = parseInt(match[2]) * sign;
        const unit = match[3].toLowerCase();
        
        const date = new Date();
        if (unit === 'd') {
            date.setDate(date.getDate() + value);
        } else if (unit === 'm') {
            date.setMonth(date.getMonth() + value);
        } else if (unit === 'y') {
            date.setFullYear(date.getFullYear() + value);
        }
        return date;
    }
    
    // Handle standard date format
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
};

// Month names based on locale
const monthNames = computed(() => {
    const months = [];
    for (let i = 0; i < 12; i++) {
        const date = new Date(2000, i, 1);
        months.push(date.toLocaleDateString(props.locale, { month: 'long' }));
    }
    return months;
});

// Day names based on locale
const dayNames = computed(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(2000, 0, 2 + i); // Jan 2, 2000 is a Sunday
        days.push(date.toLocaleDateString(props.locale, { weekday: 'short' }));
    }
    return days;
});

// Format date based on user preference
const formatDate = (date) => {
    if (!date) return "";
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    switch (props.date_format) {
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'MM-DD-YYYY':
            return `${month}-${day}-${year}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'YYYY/MM/DD':
            return `${year}/${month}/${day}`;
        case 'YYYY-MM-DD':
        default:
            return `${year}-${month}-${day}`;
    }
};

// Parse date from formatted string
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    
    let year, month, day;
    const parts = dateStr.split(/[-/]/);
    
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
    
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
};

// Display value
const displayValue = computed(() => {
    return formatDate(props.modelValue);
});

// Calendar days generation
const calendarDays = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value, 1);
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        days.push({
            day: prevMonthLastDay - i,
            currentMonth: false,
            date: new Date(currentYear.value, currentMonth.value - 1, prevMonthLastDay - i)
        });
    }
    
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
        days.push({
            day: i,
            currentMonth: true,
            date: new Date(currentYear.value, currentMonth.value, i)
        });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            day: i,
            currentMonth: false,
            date: new Date(currentYear.value, currentMonth.value + 1, i)
        });
    }
    
    return days;
});

// Check if a date is disabled
const isDateDisabled = (date) => {
    // Check disabled days of week
    if (props.disabled_days.includes(date.getDay())) {
        return true;
    }
    
    // Check min date
    if (props.min_date) {
        const minDate = parseRelativeDate(props.min_date);
        if (minDate) {
            minDate.setHours(0, 0, 0, 0);
            if (date < minDate) return true;
        }
    }
    
    // Check max date
    if (props.max_date) {
        const maxDate = parseRelativeDate(props.max_date);
        if (maxDate) {
            maxDate.setHours(0, 0, 0, 0);
            if (date > maxDate) return true;
        }
    }
    
    return false;
};

// Check if a date is selected
const isDateSelected = (date) => {
    if (!props.modelValue) return false;
    const selected = parseDate(props.modelValue) || new Date(props.modelValue);
    return date.toDateString() === selected.toDateString();
};

// Check if a date is today
const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
};

// Select a date
const selectDate = (dayObj) => {
    if (isDateDisabled(dayObj.date)) return;
    
    const formattedDate = formatDate(dayObj.date);
    emit("update:modelValue", formattedDate);
    emit("change", formattedDate);
    isOpen.value = false;
};

// Navigate months
const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
};

// Navigate years
const prevYear = () => {
    currentYear.value--;
};

const nextYear = () => {
    currentYear.value++;
};

// Go to today
const goToToday = () => {
    const today = new Date();
    currentMonth.value = today.getMonth();
    currentYear.value = today.getFullYear();
    selectDate({ date: today });
};

// Clear date
const clearDate = () => {
    emit("update:modelValue", "");
    emit("change", "");
    isOpen.value = false;
};

// Toggle datepicker
const toggleDatepicker = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value && props.modelValue) {
        const date = parseDate(props.modelValue) || new Date(props.modelValue);
        if (!isNaN(date.getTime())) {
            currentMonth.value = date.getMonth();
            currentYear.value = date.getFullYear();
        }
    }
};

// Close on outside click
const handleClickOutside = (event) => {
    if (datepickerContainer.value && !datepickerContainer.value.contains(event.target)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    if (input.value !== null && input.value.hasAttribute("autofocus")) {
        input.value.focus();
    }
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
    <div :class="field_name" v-if="show">
        <label v-if="label_name" class="gl-label-form">{{ label_name }}</label>

        <p class="mt-1 text-gray-900 dark:text-white">
            {{ displayValue }}
        </p>

        <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <div :class="{
        [field_name]: field_name && field_name !== '',
        [container_class]: container_class && container_class !== ''
    }" v-if="!show" ref="datepickerContainer">
        <label v-if="label_name" :class="{
            'gl-label-form': error_message == '',
            'gl-label-form-invalid': error_message !== '',
            required: is_required,
        }" :for="field_name">{{ label_name }}</label>

        <div class="relative">
            <div v-if="inputGroupType" class="flex items-center">
                <label v-if="inputGroupType=='prepend'" v-html="inputGroupText"
                    class="h-10 z-10 inline-flex items-center shrink-0 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 dark:text-gray-400 rounded-s-lg focus:outline-hidden dark:bg-gray-700 dark:border-gray-600">
                </label>

                <div class="relative w-full">
                    <input 
                        type="text"
                        readonly
                        class="rtl:text-right rounded-none! cursor-pointer" 
                        :required="is_required"
                        :name="field_name" 
                        :id="field_name"
                        :class="{
                            'gl-input-form': error_message == '',
                            'gl-input-form-invalid': error_message !== '',
                            [input_class]: input_class && input_class !== '',
                            'border-e-0! rounded-s-lg!': inputGroupType == 'append',
                            'border-s-0! rounded-e-lg!': inputGroupType == 'prepend'
                        }" 
                        :value="displayValue"
                        @click="toggleDatepicker"
                        @blur="$emit('blur-sm', $event)"
                        ref="input" 
                        :placeholder="placeholder" 
                    />
                    
                    <!-- Calendar Icon -->
                    <div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                    </div>
                </div>

                <label v-if="inputGroupType=='append'" v-html="inputGroupText"
                    class="h-10 z-10 inline-flex items-center shrink-0 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 dark:text-gray-400 rounded-e-lg focus:outline-hidden dark:bg-gray-700 dark:border-gray-600">
                </label>
            </div>

            <!-- Standard input without input group -->
            <div v-if="inputGroupType==''" class="relative">
                <input 
                    type="text"
                    readonly
                    class="rtl:text-right cursor-pointer pe-10"
                    :required="is_required" 
                    :name="field_name" 
                    :id="field_name" 
                    :class="{
                        'gl-input-form': error_message == '',
                        'gl-input-form-invalid': error_message !== '',
                        [input_class]: input_class && input_class !== ''
                    }" 
                    :value="displayValue"
                    @click="toggleDatepicker"
                    @blur="$emit('blur-sm', $event)"
                    ref="input" 
                    :placeholder="placeholder" 
                />
                
                <!-- Calendar Icon -->
                <div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                    </svg>
                </div>
            </div>

            <!-- Datepicker Dropdown -->
            <div 
                v-show="isOpen"
                class="absolute z-50 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-72"
            >
                <!-- Header with navigation -->
                <div class="flex items-center justify-between mb-4">
                    <button 
                        type="button"
                        @click="prevYear"
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                        </svg>
                    </button>
                    <button 
                        type="button"
                        @click="prevMonth"
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ monthNames[currentMonth] }} {{ currentYear }}
                    </span>
                    
                    <button 
                        type="button"
                        @click="nextMonth"
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button 
                        type="button"
                        @click="nextYear"
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7m-8-14l7 7-7 7"/>
                        </svg>
                    </button>
                </div>

                <!-- Day names header -->
                <div class="grid grid-cols-7 gap-1 mb-2">
                    <div 
                        v-for="day in dayNames" 
                        :key="day"
                        class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
                    >
                        {{ day }}
                    </div>
                </div>

                <!-- Calendar grid -->
                <div class="grid grid-cols-7 gap-1">
                    <button
                        v-for="(dayObj, index) in calendarDays"
                        :key="index"
                        type="button"
                        @click="selectDate(dayObj)"
                        :disabled="isDateDisabled(dayObj.date)"
                        :class="[
                            'w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors',
                            {
                                'text-gray-400 dark:text-gray-600': !dayObj.currentMonth,
                                'text-gray-900 dark:text-white': dayObj.currentMonth && !isDateSelected(dayObj.date) && !isDateDisabled(dayObj.date),
                                'bg-blue-600 text-white hover:bg-blue-700': isDateSelected(dayObj.date),
                                'ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-gray-800': isToday(dayObj.date) && !isDateSelected(dayObj.date),
                                'hover:bg-gray-100 dark:hover:bg-gray-700': !isDateSelected(dayObj.date) && !isDateDisabled(dayObj.date),
                                'opacity-50 cursor-not-allowed': isDateDisabled(dayObj.date),
                            }
                        ]"
                    >
                        {{ dayObj.day }}
                    </button>
                </div>

                <!-- Footer with actions -->
                <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button 
                        type="button"
                        @click="clearDate"
                        class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        Clear
                    </button>
                    <button 
                        type="button"
                        @click="goToToday"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                        Today
                    </button>
                </div>
            </div>
        </div>

        <span class="gl-span-form-error">{{ error_message }}</span>

        <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
    </div>
</template>
