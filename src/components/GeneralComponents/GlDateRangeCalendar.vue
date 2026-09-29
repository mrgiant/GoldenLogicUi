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

    // { start: '', end: '' }
    modelValue: {
        type: Object,
        default: () => ({ start: "", end: "" }),
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
        default: "",
    },

    input_class: {
        type: String,
        default: "",
    },

    container_class: {
        type: String,
        default: "",
    },

    // Date format options: YYYY-MM-DD, DD-MM-YYYY, MM-DD-YYYY, DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD
    date_format: {
        type: String,
        default: "YYYY-MM-DD",
    },

    // Separator shown between start and end in the input/footer
    separator: {
        type: String,
        default: "-",
    },

    // Min/max date constraints. Accepts "YYYY-MM-DD" or relative "+3m", "-1y", "+7d", "today"
    min_date: {
        type: String,
        default: null,
    },

    max_date: {
        type: String,
        default: null,
    },

    // Disable specific days of week (0 = Sunday, 6 = Saturday)
    disabled_days: {
        type: Array,
        default: () => [],
    },

    // Disable specific dates (strings in any supported format or Date objects)
    disabled_dates: {
        type: Array,
        default: () => [],
    },

    // Locale for month/day names ("en" or "ar")
    locale: {
        type: String,
        default: "en",
    },
});

const emit = defineEmits(["update:modelValue", "change"]);

const datepickerContainer = ref(null);
const isOpen = ref(false);

// The left panel month/year; the right panel is always the following month.
const today = new Date();
const viewMonth = ref(today.getMonth());
const viewYear = ref(today.getFullYear());

// Draft range while the popover is open (committed on Apply).
const draftStart = ref(null); // Date or null
const draftEnd = ref(null); // Date or null
const hoverDate = ref(null); // Date or null, for live range preview

const isRTL = computed(() => getLocale() === "ar");

/* ----------------------------- i18n ----------------------------- */
const translations = {
    en: { apply: "Apply", cancel: "Cancel" },
    ar: { apply: "تطبيق", cancel: "إلغاء" },
};

const getLocale = () => (props.locale && props.locale.startsWith("ar") ? "ar" : "en");

const t = (key) => translations[getLocale()][key] || translations.en[key] || key;

const monthNames = computed(() => {
    const months = [];
    for (let i = 0; i < 12; i++) {
        months.push(new Date(2000, i, 1).toLocaleDateString(props.locale, { month: "long" }));
    }
    return months;
});

const dayNames = computed(() => {
    // Arabic "short" weekday names are full words (الأربعاء…) that overflow the
    // narrow columns, so use the single-letter "narrow" form for Arabic.
    const weekday = getLocale() === "ar" ? "narrow" : "short";
    const days = [];
    for (let i = 0; i < 7; i++) {
        // Jan 2, 2000 is a Sunday
        days.push(new Date(2000, 0, 2 + i).toLocaleDateString(props.locale, { weekday }));
    }
    return days;
});

/* --------------------------- parsing ---------------------------- */
const parseDate = (dateStr) => {
    if (!dateStr) return null;

    let year, month, day;
    const parts = String(dateStr).split(/[-/]/);
    if (parts.length !== 3) return null;

    switch (props.date_format) {
        case "DD-MM-YYYY":
        case "DD/MM/YYYY":
            day = parseInt(parts[0]);
            month = parseInt(parts[1]) - 1;
            year = parseInt(parts[2]);
            break;
        case "MM-DD-YYYY":
        case "MM/DD/YYYY":
            month = parseInt(parts[0]) - 1;
            day = parseInt(parts[1]);
            year = parseInt(parts[2]);
            break;
        case "YYYY/MM/DD":
        case "YYYY-MM-DD":
        default:
            year = parseInt(parts[0]);
            month = parseInt(parts[1]) - 1;
            day = parseInt(parts[2]);
            break;
    }

    const date = new Date(year, month, day);
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

const parseRelativeDate = (dateStr) => {
    if (!dateStr) return null;

    if (String(dateStr).toLowerCase() === "today") return new Date();

    const match = String(dateStr).match(/^([+-]?)(\d+)([dmy])$/i);
    if (match) {
        const sign = match[1] === "-" ? -1 : 1;
        const value = parseInt(match[2]) * sign;
        const unit = match[3].toLowerCase();
        const date = new Date();
        if (unit === "d") date.setDate(date.getDate() + value);
        else if (unit === "m") date.setMonth(date.getMonth() + value);
        else if (unit === "y") date.setFullYear(date.getFullYear() + value);
        return date;
    }

    const customParsed = parseDate(dateStr);
    if (customParsed) return customParsed;

    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
};

/* -------------------------- formatting -------------------------- */
const formatDate = (date) => {
    if (!date) return "";

    let d = date instanceof Date ? date : parseDate(date);
    if (!d || isNaN(d.getTime())) d = new Date(date);
    if (isNaN(d.getTime())) return "";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    switch (props.date_format) {
        case "DD-MM-YYYY":
            return `${day}-${month}-${year}`;
        case "MM-DD-YYYY":
            return `${month}-${day}-${year}`;
        case "DD/MM/YYYY":
            return `${day}/${month}/${year}`;
        case "MM/DD/YYYY":
            return `${month}/${day}/${year}`;
        case "YYYY/MM/DD":
            return `${year}/${month}/${day}`;
        case "YYYY-MM-DD":
        default:
            return `${year}-${month}-${day}`;
    }
};

// Strip time so date-only comparisons are stable.
const atMidnight = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString();

/* ---------------------- displayed text -------------------------- */
const displayValue = computed(() => {
    const start = props.modelValue?.start;
    const end = props.modelValue?.end;
    if (!start && !end) return "";

    const s = start ? formatDate(parseDate(start) || new Date(start)) : "";
    const e = end ? formatDate(parseDate(end) || new Date(end)) : "";
    if (s && e) return `${s} ${props.separator} ${e}`;
    return s || e;
});

// Footer summary of the live draft.
const draftSummary = computed(() => {
    const s = draftStart.value ? formatDate(draftStart.value) : "…";
    const e = draftEnd.value ? formatDate(draftEnd.value) : "…";
    return `${s} ${props.separator} ${e}`;
});

/* ---------------------- calendar building ----------------------- */
const buildMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // Leading blanks so day 1 lands under its weekday — no other-month days.
    for (let i = 0; i < startingDay; i++) {
        days.push({ day: null, currentMonth: false, date: null });
    }
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    // Pad the final week with blanks so the grid stays aligned, then stop —
    // no trailing other-month days and no empty extra week.
    while (days.length % 7 !== 0) {
        days.push({ day: null, currentMonth: false, date: null });
    }
    return days;
};

const rightMonthYear = computed(() => {
    const m = viewMonth.value === 11 ? 0 : viewMonth.value + 1;
    const y = viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value;
    return { month: m, year: y };
});

const leftDays = computed(() => buildMonth(viewYear.value, viewMonth.value));
const rightDays = computed(() => buildMonth(rightMonthYear.value.year, rightMonthYear.value.month));

/* ------------------------- date states -------------------------- */
const isDateDisabled = (date) => {
    if (props.disabled_days.includes(date.getDay())) return true;

    if (props.disabled_dates && props.disabled_dates.length > 0) {
        const dateToCheck = atMidnight(date);
        for (const disabledDate of props.disabled_dates) {
            let parsed;
            if (typeof disabledDate === "string") {
                parsed = parseDate(disabledDate);
                if (!parsed || isNaN(parsed.getTime())) parsed = new Date(disabledDate);
            } else if (disabledDate instanceof Date) {
                parsed = disabledDate;
            }
            if (parsed && !isNaN(parsed.getTime()) && atMidnight(parsed).getTime() === dateToCheck.getTime()) {
                return true;
            }
        }
    }

    if (props.min_date) {
        const minDate = parseRelativeDate(props.min_date);
        if (minDate && atMidnight(date) < atMidnight(minDate)) return true;
    }
    if (props.max_date) {
        const maxDate = parseRelativeDate(props.max_date);
        if (maxDate && atMidnight(date) > atMidnight(maxDate)) return true;
    }
    return false;
};

// Effective end used for previewing the range while hovering.
const effectiveEnd = computed(() => {
    if (draftStart.value && !draftEnd.value && hoverDate.value) return hoverDate.value;
    return draftEnd.value;
});

const rangeBounds = computed(() => {
    const s = draftStart.value;
    const e = effectiveEnd.value;
    if (!s || !e) return null;
    return s <= e ? { lo: atMidnight(s), hi: atMidnight(e) } : { lo: atMidnight(e), hi: atMidnight(s) };
});

const isRangeStart = (date) => {
    const b = rangeBounds.value;
    if (b) return atMidnight(date).getTime() === b.lo.getTime();
    return sameDay(date, draftStart.value);
};

const isRangeEnd = (date) => {
    const b = rangeBounds.value;
    if (b) return atMidnight(date).getTime() === b.hi.getTime();
    return false;
};

const isInRange = (date) => {
    const b = rangeBounds.value;
    if (!b) return false;
    const d = atMidnight(date).getTime();
    return d > b.lo.getTime() && d < b.hi.getTime();
};

const isToday = (date) => sameDay(date, new Date());

/* --------------------------- actions ---------------------------- */
const selectDate = (dayObj) => {
    const date = dayObj.date;
    if (isDateDisabled(date)) return;

    // Start a fresh range, or set the end of an in-progress one.
    if (!draftStart.value || (draftStart.value && draftEnd.value)) {
        draftStart.value = atMidnight(date);
        draftEnd.value = null;
    } else {
        if (atMidnight(date) < draftStart.value) {
            draftEnd.value = draftStart.value;
            draftStart.value = atMidnight(date);
        } else {
            draftEnd.value = atMidnight(date);
        }
    }
};

const onHover = (dayObj) => {
    if (draftStart.value && !draftEnd.value && !isDateDisabled(dayObj.date)) {
        hoverDate.value = dayObj.date;
    }
};

const prev = () => {
    if (viewMonth.value === 0) {
        viewMonth.value = 11;
        viewYear.value--;
    } else {
        viewMonth.value--;
    }
};

const next = () => {
    if (viewMonth.value === 11) {
        viewMonth.value = 0;
        viewYear.value++;
    } else {
        viewMonth.value++;
    }
};

// Position the two panels around the current/selected range when opening.
const syncViewToValue = () => {
    const startSrc = props.modelValue?.start;
    const base = startSrc ? parseDate(startSrc) || new Date(startSrc) : new Date();
    if (!isNaN(base.getTime())) {
        viewMonth.value = base.getMonth();
        viewYear.value = base.getFullYear();
    }
};

const openPicker = () => {
    // Seed the draft from the committed value.
    const s = props.modelValue?.start;
    const e = props.modelValue?.end;
    draftStart.value = s ? atMidnight(parseDate(s) || new Date(s)) : null;
    draftEnd.value = e ? atMidnight(parseDate(e) || new Date(e)) : null;
    hoverDate.value = null;
    syncViewToValue();
    isOpen.value = true;
};

const toggle = () => {
    if (isOpen.value) isOpen.value = false;
    else openPicker();
};

const apply = () => {
    const value = {
        start: draftStart.value ? formatDate(draftStart.value) : "",
        end: draftEnd.value ? formatDate(draftEnd.value) : "",
    };
    emit("update:modelValue", value);
    emit("change", value);
    isOpen.value = false;
};

const cancel = () => {
    isOpen.value = false;
};

const handleClickOutside = (event) => {
    if (datepickerContainer.value && !datepickerContainer.value.contains(event.target)) {
        isOpen.value = false;
    }
};

watch(
    () => props.modelValue,
    () => {
        if (!isOpen.value) syncViewToValue();
    },
    { deep: true }
);

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
    <!-- Show mode - display only -->
    <div :class="field_name" v-if="show">
        <label v-if="label_name" class="gl-label-form">{{ label_name }}</label>

        <p class="mt-1 text-gray-900 dark:text-white">
            {{ displayValue }}
        </p>

        <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <!-- Edit mode -->
    <div
        v-if="!show"
        ref="datepickerContainer"
        :dir="isRTL ? 'rtl' : 'ltr'"
        :class="{
            [field_name]: field_name && field_name !== '',
            [container_class]: container_class && container_class !== '',
        }"
    >
        <label
            v-if="label_name"
            :class="{
                'gl-label-form': error_message == '',
                'gl-label-form-invalid': error_message !== '',
                required: is_required,
            }"
            :for="field_name"
        >{{ label_name }}</label>

        <div class="relative">
            <!-- Trigger input -->
            <div class="relative">
                <input
                    type="text"
                    readonly
                    class="rtl:text-right pe-10 cursor-pointer"
                    :required="is_required"
                    :name="field_name"
                    :id="field_name"
                    :class="{
                        'gl-input-form': error_message == '',
                        'gl-input-form-invalid': error_message !== '',
                        [input_class]: input_class && input_class !== '',
                    }"
                    :value="displayValue"
                    :placeholder="placeholder"
                    @click="toggle"
                />

                <!-- Calendar Icon -->
                <div
                    class="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                    @click="toggle"
                >
                    <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                </div>
            </div>

            <!-- Popover -->
            <div
                v-show="isOpen"
                class="absolute z-50 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4
                       w-[20rem] sm:w-auto max-w-[calc(100vw-2rem)]"
            >
                <!-- Calendars -->
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <!-- Left month -->
                    <div class="w-full sm:w-64">
                        <div class="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                @click="prev"
                                class="p-1 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg class="w-5 h-5 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span class="text-sm font-semibold text-gray-900 dark:text-white">
                                {{ monthNames[viewMonth] }} {{ viewYear }}
                            </span>
                            <span class="w-7 sm:hidden"></span>
                            <!-- Next arrow lives on the right panel on desktop; show here on mobile -->
                            <button
                                type="button"
                                @click="next"
                                class="p-1 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 sm:hidden"
                            >
                                <svg class="w-5 h-5 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div class="grid grid-cols-7 gap-y-1 mb-1">
                            <div
                                v-for="day in dayNames"
                                :key="'lh-' + day"
                                class="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-1 truncate"
                            >
                                {{ day }}
                            </div>
                        </div>

                        <div class="grid grid-cols-7">
                            <div
                                v-for="(dayObj, index) in leftDays"
                                :key="'l-' + index"
                                class="py-0.5"
                                :class="{
                                    'bg-primary/10 dark:bg-primaryDark/20': dayObj.currentMonth && (isInRange(dayObj.date) || isRangeStart(dayObj.date) || isRangeEnd(dayObj.date)),
                                    'rounded-s-full': isRangeStart(dayObj.date),
                                    'rounded-e-full': isRangeEnd(dayObj.date),
                                }"
                            >
                                <button
                                    v-if="dayObj.currentMonth"
                                    type="button"
                                    @click="selectDate(dayObj)"
                                    @mouseenter="onHover(dayObj)"
                                    :disabled="isDateDisabled(dayObj.date)"
                                    :class="[
                                        'w-9 h-9 mx-auto text-sm rounded-full flex items-center justify-center transition-colors',
                                        {
                                            'text-gray-900 dark:text-white': !isRangeStart(dayObj.date) && !isRangeEnd(dayObj.date) && !isDateDisabled(dayObj.date),
                                            'bg-primary dark:bg-primaryDark text-white font-semibold': isRangeStart(dayObj.date) || isRangeEnd(dayObj.date),
                                            'ring-1 ring-primary dark:ring-primaryDark': isToday(dayObj.date) && !isRangeStart(dayObj.date) && !isRangeEnd(dayObj.date),
                                            'hover:bg-gray-100 dark:hover:bg-gray-700': !isRangeStart(dayObj.date) && !isRangeEnd(dayObj.date) && !isDateDisabled(dayObj.date),
                                            'opacity-40 cursor-not-allowed': isDateDisabled(dayObj.date),
                                        },
                                    ]"
                                >
                                    {{ dayObj.day }}
                                </button>
                                <div v-else class="w-9 h-9 mx-auto"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Right month (desktop only) -->
                    <div class="hidden sm:block sm:w-64">
                        <div class="flex items-center justify-between mb-3">
                            <span class="w-7"></span>
                            <span class="text-sm font-semibold text-gray-900 dark:text-white">
                                {{ monthNames[rightMonthYear.month] }} {{ rightMonthYear.year }}
                            </span>
                            <button
                                type="button"
                                @click="next"
                                class="p-1 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg class="w-5 h-5 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div class="grid grid-cols-7 gap-y-1 mb-1">
                            <div
                                v-for="day in dayNames"
                                :key="'rh-' + day"
                                class="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-1 truncate"
                            >
                                {{ day }}
                            </div>
                        </div>

                        <div class="grid grid-cols-7">
                            <div
                                v-for="(dayObj, index) in rightDays"
                                :key="'r-' + index"
                                class="py-0.5"
                                :class="{
                                    'bg-primary/10 dark:bg-primaryDark/20': dayObj.currentMonth && (isInRange(dayObj.date) || isRangeStart(dayObj.date) || isRangeEnd(dayObj.date)),
                                    'rounded-s-full': isRangeStart(dayObj.date),
                                    'rounded-e-full': isRangeEnd(dayObj.date),
                                }"
                            >
                                <button
                                    v-if="dayObj.currentMonth"
                                    type="button"
                                    @click="selectDate(dayObj)"
                                    @mouseenter="onHover(dayObj)"
                                    :disabled="isDateDisabled(dayObj.date)"
                                    :class="[
                                        'w-9 h-9 mx-auto text-sm rounded-full flex items-center justify-center transition-colors',
                                        {
                                            'text-gray-900 dark:text-white': !isRangeStart(dayObj.date) && !isRangeEnd(dayObj.date) && !isDateDisabled(dayObj.date),
                                            'bg-primary dark:bg-primaryDark text-white font-semibold': isRangeStart(dayObj.date) || isRangeEnd(dayObj.date),
                                            'ring-1 ring-primary dark:ring-primaryDark': isToday(dayObj.date) && !isRangeStart(dayObj.date) && !isRangeEnd(dayObj.date),
                                            'hover:bg-gray-100 dark:hover:bg-gray-700': !isRangeStart(dayObj.date) && !isRangeEnd(dayObj.date) && !isDateDisabled(dayObj.date),
                                            'opacity-40 cursor-not-allowed': isDateDisabled(dayObj.date),
                                        },
                                    ]"
                                >
                                    {{ dayObj.day }}
                                </button>
                                <div v-else class="w-9 h-9 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span class="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {{ draftSummary }}
                    </span>

                    <div class="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            @click="cancel"
                            class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {{ t('cancel') }}
                        </button>
                        <button
                            type="button"
                            @click="apply"
                            class="px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary dark:bg-primaryDark hover:bg-primary/90 dark:hover:bg-primaryDark/90 transition-colors"
                        >
                            {{ t('apply') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <span class="gl-span-form-error">{{ error_message }}</span>

        <small v-if="description" class="block mt-1 text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
    </div>
</template>
