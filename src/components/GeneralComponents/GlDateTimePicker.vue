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
        default: "Select date & time",
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

    // Step (in minutes) used when stepping the minute selector
    minute_step: {
        type: Number,
        default: 1,
    },

    // Default time (e.g. "11:00 AM") used when a date is picked before any
    // time has been chosen. Lets a range picker seed the end picker with the
    // start time so a same-day selection isn't treated as earlier (midnight).
    default_time: {
        type: String,
        default: null,
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

    // Disable specific dates (array of date strings in any supported format or Date objects)
    // Example: ["2026-01-15", "2026-02-20", "25-12-2026"]
    disabled_dates: {
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

// Time state (12-hour clock with AM/PM)
const selectedHour = ref(12); // 1 - 12
const selectedMinute = ref(0); // 0 - 59
const selectedMeridiem = ref("AM"); // "AM" | "PM"

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

    // Try the component's configured date_format first (e.g. "DD-MM-YYYY"),
    // so constraints passed as formatted strings are interpreted correctly
    // instead of via native parsing.
    const customParsed = parseDate(dateStr);
    if (customParsed) return customParsed;

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

// Convert the 12-hour selection into a 24-hour value
const to24Hour = (hour12, meridiem) => {
    let h = hour12 % 12;
    if (meridiem === 'PM') h += 12;
    return h;
};

// Convert a 24-hour value into { hour: 1-12, meridiem: "AM"|"PM" }
const to12Hour = (hour24) => {
    const meridiem = hour24 >= 12 ? 'PM' : 'AM';
    let h = hour24 % 12;
    if (h === 0) h = 12;
    return { hour: h, meridiem };
};

// Format the date+time portion based on user preference
const formatDatePart = (d) => {
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

const formatTimePart = (d) => {
    const { hour, meridiem } = to12Hour(d.getHours());
    const hh = String(hour).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm} ${meridiem}`;
};

// Format full datetime string from a Date / string
const formatDateTime = (date) => {
    if (!date) return "";

    let d;

    // 1. If it's a string, try to parse it using our custom format first
    if (typeof date === 'string') {
        d = parseDateTime(date);
    }

    // 2. Fallback to standard Date parsing (ISO strings, Date objects)
    if (!d || isNaN(d.getTime())) {
        d = new Date(date);
    }

    // 3. If still invalid, return empty
    if (isNaN(d.getTime())) return "";

    return `${formatDatePart(d)} ${formatTimePart(d)}`;
};

// Parse the date portion of a formatted string into year/month/day
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

// Parse a date-only formatted string (used for constraints / disabled dates)
const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // Only consider the date portion (drop any trailing time)
    const datePart = String(dateStr).trim().split(' ')[0];
    const ymd = parseDatePart(datePart);
    if (!ymd) return null;

    const { year, month, day } = ymd;
    const date = new Date(year, month, day);

    // Strict validation to avoid JS Date auto-correction
    if (
        isNaN(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
};

// Parse a full datetime formatted string like "2026-06-06 03:45 PM"
const parseDateTime = (dateStr) => {
    if (!dateStr) return null;

    const trimmed = String(dateStr).trim();
    // Split into date portion and the rest (time + meridiem)
    const firstSpace = trimmed.indexOf(' ');
    const datePart = firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace);
    const timePart = firstSpace === -1 ? "" : trimmed.slice(firstSpace + 1).trim();

    const ymd = parseDatePart(datePart);
    if (!ymd) return null;

    let hour24 = 0;
    let minute = 0;

    if (timePart) {
        const match = timePart.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (match) {
            const h = parseInt(match[1]);
            minute = parseInt(match[2]);
            const meridiem = match[3] ? match[3].toUpperCase() : null;
            if (meridiem) {
                hour24 = to24Hour(h, meridiem);
            } else {
                hour24 = h; // already 24-hour
            }
        }
    }

    const { year, month, day } = ymd;
    const date = new Date(year, month, day, hour24, minute);

    if (
        isNaN(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
};

// Local display value for text input
const displayValue = ref("");
const isInputFocused = ref(false);

const syncTimeFromValue = (val) => {
    if (!val) return;
    let d = typeof val === 'string' ? parseDateTime(val) : null;
    if (!d || isNaN(d.getTime())) d = new Date(val);
    if (isNaN(d.getTime())) return;
    const { hour, meridiem } = to12Hour(d.getHours());
    selectedHour.value = hour;
    selectedMinute.value = d.getMinutes();
    selectedMeridiem.value = meridiem;
};

// Seed the time selectors from default_time (e.g. "11:00 AM") when no value
// has been chosen yet, so picking a date doesn't fall back to 12:00 AM.
const seedDefaultTime = () => {
    if (!props.default_time) return;
    const match = String(props.default_time).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return;
    const h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const meridiem = match[3] ? match[3].toUpperCase() : null;
    if (meridiem) {
        selectedHour.value = h === 0 ? 12 : h;
        selectedMeridiem.value = meridiem;
    } else {
        const conv = to12Hour(h);
        selectedHour.value = conv.hour;
        selectedMeridiem.value = conv.meridiem;
    }
    selectedMinute.value = m;
};

// Sync displayValue + time state when modelValue changes externally
watch(() => props.modelValue, (newVal) => {
    if (isInputFocused.value) return;
    displayValue.value = formatDateTime(newVal);
    if (newVal) syncTimeFromValue(newVal);
    else seedDefaultTime();
}, { immediate: true });

// Re-seed when the default changes (e.g. start time updated) while end is empty
watch(() => props.default_time, () => {
    if (!props.modelValue) seedDefaultTime();
});

// Handle direct text input
const handleInput = (event) => {
    const inputValue = event.target.value;
    displayValue.value = inputValue;

    if (inputValue === "") {
        emit("update:modelValue", "");
        emit("change", "");
    }
};

// Handle blur to validate and format the input
const handleBlur = (event) => {
    isInputFocused.value = false;
    const inputValue = displayValue.value;
    const parsed = parseDateTime(inputValue);

    if (parsed && !isNaN(parsed.getTime()) && !isDateDisabled(parsed)) {
        const formatted = formatDateTime(parsed);
        displayValue.value = formatted;
        syncTimeFromValue(formatted);
        emit("update:modelValue", formatted);
        emit("change", formatted);
    } else if (inputValue !== "") {
        // Revert to the last valid value if invalid
        displayValue.value = formatDateTime(props.modelValue);
    }

    emit("blur-sm", event);
};

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

// Check if a date is disabled (constraints operate on the date portion only)
const isDateDisabled = (date) => {
    // Check disabled days of week
    if (props.disabled_days.includes(date.getDay())) {
        return true;
    }

    // Check disabled specific dates
    if (props.disabled_dates && props.disabled_dates.length > 0) {
        const dateToCheck = new Date(date);
        dateToCheck.setHours(0, 0, 0, 0);

        for (const disabledDate of props.disabled_dates) {
            let parsedDisabledDate;

            if (typeof disabledDate === 'string') {
                parsedDisabledDate = parseDate(disabledDate);
                if (!parsedDisabledDate || isNaN(parsedDisabledDate.getTime())) {
                    parsedDisabledDate = new Date(disabledDate);
                }
            } else if (disabledDate instanceof Date) {
                parsedDisabledDate = disabledDate;
            }

            if (parsedDisabledDate && !isNaN(parsedDisabledDate.getTime())) {
                parsedDisabledDate.setHours(0, 0, 0, 0);
                if (dateToCheck.getTime() === parsedDisabledDate.getTime()) {
                    return true;
                }
            }
        }
    }

    // Compare by date only for min/max constraints
    const dayOnly = new Date(date);
    dayOnly.setHours(0, 0, 0, 0);

    // Check min date
    if (props.min_date) {
        const minDate = parseRelativeDate(props.min_date);
        if (minDate) {
            minDate.setHours(0, 0, 0, 0);
            if (dayOnly < minDate) return true;
        }
    }

    // Check max date
    if (props.max_date) {
        const maxDate = parseRelativeDate(props.max_date);
        if (maxDate) {
            maxDate.setHours(0, 0, 0, 0);
            if (dayOnly > maxDate) return true;
        }
    }

    return false;
};

// Check if a date is selected
const isDateSelected = (date) => {
    if (!props.modelValue) return false;
    const selected = parseDateTime(props.modelValue) || new Date(props.modelValue);
    if (isNaN(selected.getTime())) return false;
    return date.toDateString() === selected.toDateString();
};

// Check if a date is today
const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
};

// Build a Date combining the given day with the currently selected time
const composeDateTime = (dateObj) => {
    const hour24 = to24Hour(selectedHour.value, selectedMeridiem.value);
    return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        hour24,
        selectedMinute.value
    );
};

// Emit the current date + time combination (keeps picker open)
const emitDateTime = (dateObj) => {
    const combined = composeDateTime(dateObj);
    const formatted = formatDateTime(combined);
    displayValue.value = formatted;
    emit("update:modelValue", formatted);
    emit("change", formatted);
};

// The currently selected date (or today as a fallback for applying time changes)
const getSelectedDateOrToday = () => {
    const parsed = parseDateTime(props.modelValue);
    if (parsed && !isNaN(parsed.getTime())) return parsed;
    return new Date();
};

// Select a date (combines with current time selection)
const selectDate = (dayObj) => {
    if (isDateDisabled(dayObj.date)) return;
    emitDateTime(dayObj.date);
};

// Time changes re-emit using the already-selected date
const onTimeChange = () => {
    if (!props.modelValue) return; // wait until a date is picked
    emitDateTime(getSelectedDateOrToday());
};

const setMeridiem = (value) => {
    selectedMeridiem.value = value;
    onTimeChange();
};

const stepHour = (delta) => {
    let h = selectedHour.value + delta;
    if (h > 12) h = 1;
    if (h < 1) h = 12;
    selectedHour.value = h;
    onTimeChange();
};

const stepMinute = (delta) => {
    let m = selectedMinute.value + delta * props.minute_step;
    if (m > 59) m = 0;
    if (m < 0) m = 59 - ((59 - m) % 60);
    selectedMinute.value = ((m % 60) + 60) % 60;
    onTimeChange();
};

const onHourInput = (event) => {
    // Keep only digits and cap at 2 characters so "123" can't be entered
    let raw = event.target.value.replace(/\D/g, '').slice(0, 2);
    let h = parseInt(raw);
    if (isNaN(h)) h = 0;
    // Clamp 1 - 12 (0 stays 0 so the user can keep typing e.g. "0" then "9")
    if (h > 12) h = 12;
    if (raw !== "" && h < 1) h = 1;
    // Reflect the validated value back into the box (one-way :value won't repaint
    // when the clamped value matches the previous state)
    event.target.value = raw === "" ? "" : String(h);
    if (raw === "") return;
    selectedHour.value = h;
    onTimeChange();
};

const onMinuteInput = (event) => {
    let raw = event.target.value.replace(/\D/g, '').slice(0, 2);
    let m = parseInt(raw);
    if (isNaN(m)) m = 0;
    if (m > 59) m = 59;
    if (m < 0) m = 0;
    event.target.value = raw === "" ? "" : String(m);
    if (raw === "") return;
    selectedMinute.value = m;
    onTimeChange();
};

// On blur, normalise empties and re-pad to two digits (e.g. "" -> "12"/"00", "3" -> "03")
const onHourBlur = (event) => {
    if (selectedHour.value < 1) selectedHour.value = 12;
    event.target.value = String(selectedHour.value).padStart(2, '0');
    onTimeChange();
};

const onMinuteBlur = (event) => {
    event.target.value = String(selectedMinute.value).padStart(2, '0');
    onTimeChange();
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

// Translations for button labels
const translations = {
    en: {
        clear: 'Clear',
        now: 'Now',
        done: 'Done',
        time: 'Time',
    },
    ar: {
        clear: 'مسح',
        now: 'الآن',
        done: 'تم',
        time: 'الوقت',
    },
};

const getLocale = () => {
    return props.locale && props.locale.startsWith('ar') ? 'ar' : 'en';
};

const t = (key) => {
    const locale = getLocale();
    return translations[locale][key] || translations['en'][key] || key;
};

// Go to now (current date + time)
const goToNow = () => {
    const now = new Date();
    currentMonth.value = now.getMonth();
    currentYear.value = now.getFullYear();
    syncTimeFromValue(now);
    emitDateTime(now);
};

// Clear value
const clearDate = () => {
    displayValue.value = "";
    emit("update:modelValue", "");
    emit("change", "");
    isOpen.value = false;
};

const handleFocus = () => {
    isInputFocused.value = true;
};

// Toggle picker
const toggleDatepicker = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value && props.modelValue) {
        const date = parseDateTime(props.modelValue) || new Date(props.modelValue);
        if (!isNaN(date.getTime())) {
            currentMonth.value = date.getMonth();
            currentYear.value = date.getFullYear();
            syncTimeFromValue(date);
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
                        class="rtl:text-right rounded-none!"
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
                        @input="handleInput"
                        @focus="handleFocus"
                        @blur="handleBlur"
                        ref="input"
                        :placeholder="placeholder"
                    />

                    <!-- Calendar / clock Icon -->
                    <div class="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer" @click="toggleDatepicker">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Zm7-6 1.5 1.5"/>
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
                    class="rtl:text-right pe-10"
                    :required="is_required"
                    :name="field_name"
                    :id="field_name"
                    :class="{
                        'gl-input-form': error_message == '',
                        'gl-input-form-invalid': error_message !== '',
                        [input_class]: input_class && input_class !== ''
                    }"
                    :value="displayValue"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    ref="input"
                    :placeholder="placeholder"
                />

                <!-- Calendar / clock Icon -->
                <div class="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer" @click="toggleDatepicker">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Zm7-6 1.5 1.5"/>
                    </svg>
                </div>
            </div>

            <!-- Datetime picker Dropdown -->
            <div
                v-show="isOpen"
                class="absolute z-50 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80 max-w-80"
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
                <div class="grid grid-cols-7 gap-2 mb-2">
                    <div
                        v-for="day in dayNames"
                        :key="day"
                        class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
                    >
                        {{ day }}
                    </div>
                </div>

                <!-- Calendar grid -->
                <div class="grid grid-cols-7 gap-2">
                    <button
                        v-for="(dayObj, index) in calendarDays"
                        :key="index"
                        type="button"
                        @click="selectDate(dayObj)"
                        :disabled="isDateDisabled(dayObj.date)"
                        :class="[
                            'w-7 h-7 text-sm rounded-full flex items-center justify-center transition-colors',
                            {
                                'text-gray-400 dark:text-gray-600': !dayObj.currentMonth,
                                'text-gray-900 dark:text-white': dayObj.currentMonth && !isDateSelected(dayObj.date) && !isDateDisabled(dayObj.date),
                                'bg-primary dark:bg-primaryDark text-white hover:bg-primary/90 dark:hover:bg-primaryDark/90': isDateSelected(dayObj.date),
                                'ring-2 ring-primary dark:ring-primaryDark ring-offset-1 dark:ring-offset-gray-800': isToday(dayObj.date) && !isDateSelected(dayObj.date),
                                'hover:bg-gray-100 dark:hover:bg-gray-700': !isDateSelected(dayObj.date) && !isDateDisabled(dayObj.date),
                                'opacity-50 cursor-not-allowed': isDateDisabled(dayObj.date),
                            }
                        ]"
                    >
                        {{ dayObj.day }}
                    </button>
                </div>

                <!-- Time picker (12-hour with AM/PM) -->
                <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-center gap-2">
                        <span class="text-xs font-medium text-gray-500 dark:text-gray-400 me-1">{{ t('time') }}</span>

                        <!-- Hour -->
                        <div class="flex flex-col items-center">
                            <button
                                type="button"
                                @click="stepHour(1)"
                                class="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                </svg>
                            </button>
                            <input
                                type="text"
                                inputmode="numeric"
                                maxlength="2"
                                :value="String(selectedHour).padStart(2, '0')"
                                @input="onHourInput"
                                @blur="onHourBlur"
                                class="w-12 text-center text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1 focus:outline-hidden focus:ring-2 focus:ring-primary dark:focus:ring-primaryDark"
                            />
                            <button
                                type="button"
                                @click="stepHour(-1)"
                                class="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                        </div>

                        <span class="text-lg font-semibold text-gray-900 dark:text-white pb-1">:</span>

                        <!-- Minute -->
                        <div class="flex flex-col items-center">
                            <button
                                type="button"
                                @click="stepMinute(1)"
                                class="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                </svg>
                            </button>
                            <input
                                type="text"
                                inputmode="numeric"
                                maxlength="2"
                                :value="String(selectedMinute).padStart(2, '0')"
                                @input="onMinuteInput"
                                @blur="onMinuteBlur"
                                class="w-12 text-center text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1 focus:outline-hidden focus:ring-2 focus:ring-primary dark:focus:ring-primaryDark"
                            />
                            <button
                                type="button"
                                @click="stepMinute(-1)"
                                class="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                        </div>

                        <!-- AM / PM -->
                        <div class="flex flex-col gap-1 ms-1">
                            <button
                                type="button"
                                @click="setMeridiem('AM')"
                                :class="[
                                    'px-2 py-1 text-xs font-medium rounded-md transition-colors',
                                    selectedMeridiem === 'AM'
                                        ? 'bg-primary dark:bg-primaryDark text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                ]"
                            >
                                AM
                            </button>
                            <button
                                type="button"
                                @click="setMeridiem('PM')"
                                :class="[
                                    'px-2 py-1 text-xs font-medium rounded-md transition-colors',
                                    selectedMeridiem === 'PM'
                                        ? 'bg-primary dark:bg-primaryDark text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                ]"
                            >
                                PM
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer with actions -->
                <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        @click="clearDate"
                        class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        {{ t('clear') }}
                    </button>
                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            @click="goToNow"
                            class="text-sm text-primary dark:text-primaryDark hover:text-primary/80 dark:hover:text-primaryDark/80 font-medium"
                        >
                            {{ t('now') }}
                        </button>
                        <button
                            type="button"
                            @click="isOpen = false"
                            class="text-sm text-primary dark:text-primaryDark hover:text-primary/80 dark:hover:text-primaryDark/80 font-medium"
                        >
                            {{ t('done') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <span class="gl-span-form-error">{{ error_message }}</span>

        <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
    </div>
</template>
