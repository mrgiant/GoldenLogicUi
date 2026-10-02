<template>
    <!-- Show mode - display only -->
    <div class="md:col-span-2" :class="field_name" v-if="show">
        <label v-if="label_name" class="gl-label-form">{{ label_name }}</label>

        <p class="mt-1 text-gray-900 dark:text-white">
            <span dir="ltr">{{ displayTime(modelValue.start) }} – {{ displayTime(modelValue.end) }}</span>
        </p>
        <p v-if="summary" class="text-sm text-gray-500 dark:text-gray-400">{{ summary.text }}</p>

        <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <!-- Edit mode -->
    <div
        v-if="!show"
        ref="root"
        class="md:col-span-2"
        @focusout="onFocusOut"
        :class="{
            [field_name]: field_name && field_name !== '',
            [container_class]: container_class && container_class !== '',
        }"
    >
        <label
            v-if="label_name"
            :class="{
                'gl-label-form': !hasError,
                'gl-label-form-invalid': hasError,
                required: is_required,
            }"
            :for="field_name + '_start'"
        >{{ label_name }}</label>

        <div class="flex flex-col items-center gap-2 md:flex-row md:items-start">
            <div v-for="side in ['start', 'end']" :key="side" class="relative w-full md:flex-1">
                <label
                    v-if="side === 'start' ? label_name_start : label_name_end"
                    :for="field_name + '_' + side"
                    class="gl-label-form"
                >{{ side === 'start' ? label_name_start : label_name_end }}</label>

                <div class="relative">
                    <input
                        :id="field_name + '_' + side"
                        :name="field_name + '_' + side"
                        type="text"
                        dir="ltr"
                        autocomplete="off"
                        :required="is_required"
                        :placeholder="side === 'start' ? placeholder_start : placeholder_end"
                        :value="typing[side] !== null ? typing[side] : displayTime(internal[side])"
                        :class="hasError ? 'gl-input-form-invalid' : 'gl-input-form'"
                        class="pe-10 text-start"
                        :aria-expanded="open === side"
                        @focus="openPanel(side)"
                        @input="typing[side] = $event.target.value"
                        @blur="commitTyped(side)"
                        @keydown.enter.prevent="commitTyped(side); closePanel()"
                        @keydown.esc="closePanel()"
                        @keydown.up.prevent="step(side, 'minute', 1)"
                        @keydown.down.prevent="step(side, 'minute', -1)"
                    />

                    <!-- Clock icon -->
                    <button
                        type="button"
                        tabindex="-1"
                        class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-500 dark:text-gray-400"
                        :aria-label="t('pick_time')"
                        @mousedown.prevent
                        @click="open === side ? closePanel() : openPanel(side)"
                    >
                        <svg class="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" stroke-width="2" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 2" />
                        </svg>
                    </button>
                </div>

                <!-- Time panel -->
                <div
                    v-if="open === side"
                    class="absolute start-0 z-50 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    @mousedown.prevent
                >
                    <div class="flex items-center justify-center gap-2" dir="ltr">
                        <!-- Hour -->
                        <div class="flex flex-col items-center">
                            <button type="button" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                :aria-label="t('later')" @click="step(side, 'hour', 1)">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <span class="w-12 rounded-md border border-gray-300 bg-white py-1 text-center text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                {{ String(parts(internal[side]).hour12).padStart(2, '0') }}
                            </span>
                            <button type="button" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                :aria-label="t('earlier')" @click="step(side, 'hour', -1)">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>

                        <span class="pb-1 text-lg font-semibold text-gray-900 dark:text-white">:</span>

                        <!-- Minute -->
                        <div class="flex flex-col items-center">
                            <button type="button" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                :aria-label="t('later')" @click="step(side, 'minute', 1)">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <span class="w-12 rounded-md border border-gray-300 bg-white py-1 text-center text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                {{ String(parts(internal[side]).minute).padStart(2, '0') }}
                            </span>
                            <button type="button" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                :aria-label="t('earlier')" @click="step(side, 'minute', -1)">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>

                        <!-- AM / PM -->
                        <div class="ms-1 flex flex-col gap-1">
                            <button v-for="meridiem in ['AM', 'PM']" :key="meridiem" type="button"
                                class="rounded-md px-2 py-1 text-xs font-medium transition-colors"
                                :class="parts(internal[side]).meridiem === meridiem
                                    ? 'bg-primary text-white dark:bg-primaryDark'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'"
                                @click="setMeridiem(side, meridiem)">
                                {{ meridiem }}
                            </button>
                        </div>
                    </div>

                    <!-- Shortcuts -->
                    <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                        <button v-if="side === 'end'" type="button"
                            class="text-sm font-medium text-primary hover:text-primary/80 dark:text-primaryDark"
                            @click="setValue('end', '00:00'); closePanel()">
                            {{ t('midnight') }}
                        </button>
                        <button v-else type="button"
                            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            @click="setValue('start', ''); closePanel()">
                            {{ t('clear') }}
                        </button>

                        <button type="button"
                            class="text-sm font-medium text-primary hover:text-primary/80 dark:text-primaryDark"
                            @click="closePanel()">
                            {{ t('done') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- What the two times mean together -->
        <p v-if="summary && !hasError" class="mt-1.5 text-sm"
            :class="summary.overnight ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'">
            <span dir="ltr">{{ displayTime(internal.start) }} – {{ displayTime(internal.end) }}</span>
            · {{ summary.text }}
        </p>

        <div v-if="hasError" class="mt-1">
            <span class="gl-span-form-error">{{ error_message || validationMessage }}</span>
        </div>

        <small v-if="description" class="mt-1 block text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

/**
 * A pair of clock times with no date: opening hours, a shift, a clinic session.
 *
 * Values are 24-hour "HH:mm" strings, the same shape an <input type="time">
 * gives and a TIME column stores. The end may be at or before the start: that
 * is read as running into the next day, so "08:00 – 00:00" is open until
 * midnight and "20:00 – 04:00" is a night shift. Set allow_overnight to false
 * where that makes no sense; then the end must follow the start on the same
 * day, and allow_equal says whether the two may be the same time.
 *
 * The words under the fields ("until midnight", "closes the next day",
 * "open 24 hours") suit opening hours; pass labels to say it another way for
 * a shift or a session, or show_summary=false to say nothing.
 */
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({ start: "", end: "" }),
    },
    field_name: { type: String, default: "" },
    label_name: { type: String, default: "" },
    label_name_start: { type: String, default: "" },
    label_name_end: { type: String, default: "" },
    placeholder_start: { type: String, default: "" },
    placeholder_end: { type: String, default: "" },
    description: { type: String, default: "" },
    is_required: { type: Boolean, default: false },
    show: { type: Boolean, default: false },
    error_message: { type: String, default: "" },
    container_class: { type: String, default: "" },
    // Minutes moved by one press of the minute arrows
    minute_step: { type: Number, default: 5 },
    // Whether an end at or before the start means the next day. When false the
    // end must be after the start, except that 00:00 is accepted as midnight
    // (the end of the day), so a range is never longer than 24 hours.
    allow_overnight: { type: Boolean, default: true },
    // With overnight off: whether the end may equal the start, as a date range
    // may start and end on the same day. Off, equal times are refused.
    allow_equal: { type: Boolean, default: true },
    // Show the line explaining the range ("… · 9 hours", "Closes the next day …")
    show_summary: { type: Boolean, default: true },
    // "en" and "ar" are built in; anything else falls back to English
    locale: { type: String, default: "en" },
    // Override any built-in text, e.g. from the app's own language files
    labels: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["update:modelValue", "change"]);

// ─── Text ────────────────────────────────────────────────────────────────

const translations = {
    en: {
        midnight: "Midnight",
        clear: "Clear",
        done: "Done",
        pick_time: "Pick a time",
        later: "Later",
        earlier: "Earlier",
        until_midnight: "until midnight",
        next_day: "closes the next day",
        all_day: "open 24 hours",
        end_after_start: "The end time must be after the start time.",
        end_not_before_start: "The end time must not be before the start time.",
        invalid: "Enter a time such as 8:30 AM.",
    },
    ar: {
        midnight: "منتصف الليل",
        clear: "مسح",
        done: "تم",
        pick_time: "اختر الوقت",
        later: "لاحقاً",
        earlier: "أبكر",
        until_midnight: "حتى منتصف الليل",
        next_day: "يغلق في اليوم التالي",
        all_day: "مفتوح 24 ساعة",
        end_after_start: "يجب أن يكون وقت الانتهاء بعد وقت البدء.",
        end_not_before_start: "يجب ألا يكون وقت الانتهاء قبل وقت البدء.",
        invalid: "أدخل وقتاً مثل 8:30 AM.",
    },
};

const language = computed(() => (props.locale && props.locale.startsWith("ar") ? "ar" : "en"));

const t = (key) => props.labels[key] || translations[language.value][key] || translations.en[key] || key;

// ─── Values ──────────────────────────────────────────────────────────────

const internal = ref({ start: "", end: "" });
const typing = ref({ start: null, end: null });
const open = ref(null);
// Text that could not be read as a time; the range check is computed below.
const typedError = ref("");
const root = ref(null);

/** "8", "8:5", "08:05:00", "8:30 pm", "20:30" -> "08:30" style, or null. */
const normalise = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    const text = String(value).trim();

    if (text === "") {
        return "";
    }

    const match = text.match(/^(\d{1,2})(?::(\d{1,2}))?(?::\d{1,2})?\s*([ap])\.?\s*m?\.?$/i)
        || text.match(/^(\d{1,2})(?::(\d{1,2}))?(?::\d{1,2})?$/);

    if (!match) {
        return null;
    }

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2] || "0", 10);
    const meridiem = match[3] ? match[3].toUpperCase() : null;

    if (minute > 59) {
        return null;
    }

    if (meridiem) {
        if (hour < 1 || hour > 12) {
            return null;
        }

        hour = (hour % 12) + (meridiem === "P" ? 12 : 0);
    } else if (hour > 23) {
        return null;
    }

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

watch(
    () => props.modelValue,
    (value) => {
        internal.value.start = normalise(value?.start) ?? "";
        internal.value.end = normalise(value?.end) ?? "";
    },
    { immediate: true, deep: true }
);

const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);

    return (h * 60) + m;
};

const fromMinutes = (total) => {
    const wrapped = ((total % 1440) + 1440) % 1440;

    return `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`;
};

/** { hour12, minute, meridiem } for the panel, from an "HH:mm" value. */
const parts = (hhmm) => {
    const value = hhmm || "08:00";
    const [h, m] = value.split(":").map(Number);

    return { hour12: (h % 12) || 12, minute: m, meridiem: h >= 12 ? "PM" : "AM" };
};

/** "08:30" -> "8:30 AM"; empty stays empty. */
const displayTime = (hhmm) => {
    const value = normalise(hhmm);

    if (!value) {
        return "";
    }

    const p = parts(value);

    return `${p.hour12}:${String(p.minute).padStart(2, "0")} ${p.meridiem}`;
};

// ─── Editing ─────────────────────────────────────────────────────────────

const publish = () => {
    const value = { start: internal.value.start, end: internal.value.end };

    typedError.value = "";
    emit("update:modelValue", value);
    emit("change", value);
};

const setValue = (side, hhmm) => {
    internal.value[side] = hhmm;
    typing.value[side] = null;
    publish();
};

const step = (side, unit, direction) => {
    const current = internal.value[side] || (side === "end" ? "17:00" : "08:00");
    const delta = unit === "hour" ? direction * 60 : direction * props.minute_step;

    // Minute steps land on the step, so 08:07 moves to 08:10, not 08:12.
    let next = toMinutes(current) + delta;

    if (unit === "minute" && props.minute_step > 1) {
        next = direction > 0
            ? Math.floor(next / props.minute_step) * props.minute_step
            : Math.ceil(next / props.minute_step) * props.minute_step;
    }

    setValue(side, fromMinutes(next));
};

const setMeridiem = (side, meridiem) => {
    const current = internal.value[side] || (side === "end" ? "17:00" : "08:00");
    const minutes = toMinutes(current);
    const isPm = minutes >= 720;

    if ((meridiem === "PM") !== isPm) {
        setValue(side, fromMinutes(minutes + (meridiem === "PM" ? 720 : -720)));
    }
};

/** Typed text is read when the field is left, so partial typing is not fought. */
const commitTyped = (side) => {
    const text = typing.value[side];

    if (text === null) {
        return;
    }

    const value = normalise(text);

    if (value === null) {
        typedError.value = t("invalid");
        return;
    }

    setValue(side, value);
};

const openPanel = (side) => {
    open.value = side;
    document.addEventListener("mousedown", onOutside);
};

const closePanel = () => {
    open.value = null;
    document.removeEventListener("mousedown", onOutside);
};

const onOutside = (event) => {
    if (root.value && !root.value.contains(event.target)) {
        closePanel();
    }
};

/** Tabbing out of both fields closes the panel, as clicking elsewhere does. */
const onFocusOut = (event) => {
    if (root.value && !root.value.contains(event.relatedTarget)) {
        closePanel();
    }
};

onBeforeUnmount(() => document.removeEventListener("mousedown", onOutside));

// ─── Meaning ─────────────────────────────────────────────────────────────

/**
 * Minutes from start to end.
 *
 * With overnight allowed, an end at or before the start runs into the next
 * day, equal times being the whole day. Without it, midnight (00:00) is the
 * end of the day, equal times are a range of no length, and an end before the
 * start is no range at all: null, and reported below.
 */
const span = computed(() => {
    const { start, end } = internal.value;

    if (!start || !end) {
        return null;
    }

    const from = toMinutes(start);
    const to = toMinutes(end);

    if (props.allow_overnight) {
        return to > from ? to - from : (to + 1440) - from;
    }

    const closes = end === "00:00" ? 1440 : to;

    return closes >= from ? closes - from : null;
});

/** Whether the range runs into the next day, which only overnight ranges can. */
const isOvernight = computed(() => {
    const { start, end } = internal.value;

    return props.allow_overnight && !!start && !!end && toMinutes(end) <= toMinutes(start);
});

/**
 * With overnight ranges switched off, the end must come after the start on the
 * same day — or equal it, when allow_equal is on, as a date range may start
 * and end on the same day. Midnight (00:00) is always allowed as an end: it
 * means the end of the day, so 08:00 – 00:00 is sixteen hours and
 * 00:00 – 00:00 is the whole day, the most there can be. Worked out from the
 * values themselves, so a bad range already saved shows its error as soon as
 * the form opens.
 */
const rangeError = computed(() => {
    const { start, end } = internal.value;

    if (props.allow_overnight || !start || !end) {
        return "";
    }

    const from = toMinutes(start);
    const closes = end === "00:00" ? 1440 : toMinutes(end);

    if (closes > from || (closes === from && props.allow_equal)) {
        return "";
    }

    return t(props.allow_equal ? "end_not_before_start" : "end_after_start");
});

const validationMessage = computed(() => typedError.value || rangeError.value);

const hasError = computed(() => props.error_message !== "" || validationMessage.value !== "");

/** "9 hours", "8 hours 30 minutes" — or the Arabic forms, which count differently. */
const duration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    if (language.value === "ar") {
        const hourWord = (n) => (n === 1 ? "ساعة واحدة" : n === 2 ? "ساعتان" : n <= 10 ? `${n} ساعات` : `${n} ساعة`);
        const minuteWord = (n) => (n === 1 ? "دقيقة واحدة" : n === 2 ? "دقيقتان" : n <= 10 ? `${n} دقائق` : `${n} دقيقة`);

        return [hours ? hourWord(hours) : "", rest ? minuteWord(rest) : ""].filter(Boolean).join(" و ");
    }

    return [
        hours ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "",
        rest ? `${rest} ${rest === 1 ? "minute" : "minutes"}` : "",
    ].filter(Boolean).join(" ");
};

/**
 * One line that says what the pair of times means, so an overnight range is
 * never a surprise: "until midnight", "closes the next day", "open 24 hours".
 */
const summary = computed(() => {
    if (!props.show_summary || span.value === null) {
        return null;
    }

    const { end } = internal.value;

    if (span.value === 1440) {
        return { text: t("all_day"), overnight: isOvernight.value };
    }

    // The same time twice: a range of no length has nothing to say about itself.
    if (span.value === 0) {
        return null;
    }

    const length = duration(span.value);

    if (end === "00:00") {
        return { text: `${t("until_midnight")} · ${length}`, overnight: false };
    }

    if (isOvernight.value) {
        return { text: `${t("next_day")} · ${length}`, overnight: true };
    }

    return { text: length, overnight: false };
});

defineExpose({ span, isOvernight });
</script>
