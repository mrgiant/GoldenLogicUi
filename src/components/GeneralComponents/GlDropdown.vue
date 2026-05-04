<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>

    <p class="mt-3 mb-4">
      <span v-if="isObjectNotEmpty(selected)"
        class="bg-blue-100 text-blue-800 text-sm font-medium mb-2 mt-2 me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300"
        >{{ selected?.name }}</span
      >
    </p>

    <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
  </div>

  <div :class="field_name" v-if="!show">
    <input
      type="hidden"
      :name="field_name"
      :id="field_name"
      :value="selected?.id"
    />

    <div class="dropdown" v-if="options">
      <label
        v-if="label_name"
        :class="{
          'gl-label-form': error_message == '',
          'gl-label-form-invalid': error_message !== '',
          required: is_required,
        }"
        >{{ label_name }}</label
      >

      <div
        
        class="relative focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <div class="relative showOptions">
          <input
            ref="myDivDropDown"
            :class="{
              'gl-input-form': error_message == '',
              'gl-input-form-invalid': error_message !== '',
              [`showOptions${uuid}`]: true,
              'pr-14!': isObjectNotEmpty(selected) && has_cancel,
              'pr-8!': !(isObjectNotEmpty(selected) && has_cancel),
            }"
            class="truncate showOptions1"
            :value="selected?.name"
            :placeholder="placeholder"
            autocomplete="off"
            readonly
          />

          <i
            v-show="isObjectNotEmpty(selected) && has_cancel"
            @click.stop="ClearInput()"
            class="absolute text-gray-500 cursor-pointer pointer-events-auto ltr:right-8 rtl:left-8 hover:text-red-600 dark:hover:text-red-400"
            style="top: 13px"
          >
            <svg
              class="w-[10px] h-[16px]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </i>
          <i
            @click.stop="showOptions()"
            class="absolute text-xl text-gray-500 cursor-pointer ltr:right-2 rtl:left-2 hover:text-gray-700 dark:hover:text-gray-700 showOptions"
            style="top: 14px"
          >
            <svg
              :class="optionsShown ? '' : 'rotate-180'"
              class="w-3 h-3 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              ></path>
            </svg>
          </i>

          <!-- Dropdown Menu -->
          <div
            class="text-gray-700 bg-white border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200  absolute w-full z-999999999 rounded-md mt-1 pt-1"
            v-show="optionsShown"
            
          >
            <div class="border-b border-gray-200 dark:border-gray-700" v-if="!hide_search">
              <label
                for="default-search"
                class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >Search</label
              >
              <div class="relative">
                <div
                  class="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3"
                >
                  
                </div>
                <input
                  type="search"
                  v-model="searchFilter"
                  :id="`${field_name}search${uuid}`"
                  @keydown="handleKeyDown"
                  @blur="exit()"
                  autocomplete="off"
                  class="block w-full p-2 text-sm text-gray-900   outline-hidden     dark:bg-gray-800   dark:text-white "
                  :placeholder="search_input_placeholder"
                />
              </div>
            </div>

            <div
              class="overflow-y-auto max-h-64 px-1 py-1"
              @scroll="handleScroll"
              ref="dropdownRef"
            >
              <div
                v-if="filteredOptions.length"
                class="relative px-2 py-0.5 text-xs leading-4 text-gray-700 no-underline cursor-pointer dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white hover:rounded-sm"
                @click="selectOption(option)"
                @mousedown="selectOption(option)"
                v-for="(option, index) in filteredOptions"
                :class="
                  index + 1 == count ? 'bg-gray-100 dark:bg-gray-700 rounded-sm' : ''
                "
                :key="index"
                :id="`${index + 1}${uuid}`"
              >
                <div class="flex items-center py-2  pr-4">
                  <svg
                    v-if="selected?.id === option.id"
                    class="absolute flex items-center shrink-0 w-4 h-4 text-green-500 ltr:right-2 rtl:left-2 dark:text-green-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>

                  <span v-html="option.name || option.id || '-'"> </span>
                </div>
              </div>

              <div v-if="isLoading" class="p-2 text-center text-gray-500">
                Loading...
              </div>

              <div
                v-if="!isLoading && filteredOptions.length === 0 && !(allow_custom && searchFilter)"
                class="p-2 text-gray-500"
              >
                {{
                  no_results_found_placeholder
                }}
              </div>

              <div
                v-if="allow_custom && searchFilter && !filteredOptions.find(o => String(o.name) === String(searchFilter))"
                class="relative px-2 py-0.5 text-xs leading-4 text-gray-700 no-underline cursor-pointer dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white hover:rounded-sm"
                @click="selectCustomOption()"
                @mousedown="selectCustomOption()"
              >
                <div class="flex items-center py-2 pr-4">
                  <span>{{ custom_option_label }} "{{ searchFilter }}"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <span class="block mt-1 text-sm font-normal leading-5 text-red-500">{{
      error_message
    }}</span>

    <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
      {{ description }}
    </small>
  </div>
</template>

<script setup>
import {
  ref,
  shallowRef,
  watch,
  defineProps,
  defineEmits,
  onMounted,
  computed,
  nextTick,
  onBeforeUnmount,
} from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  defaultValue: {
    type: [String, Number],
    default: "",
  },
  field_name: {
    type: String,
    default: "",
  },
  is_required: {
    type: Boolean,
    default: false,
  },
  has_cancel: {
    type: Boolean,
    default: true,
  },
  label_name: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
    note: "Options of dropdown. An array of options with id and name",
  },
  placeholder: {
    type: String,
    required: false,
    default: "Please select an option",
    note: "Placeholder of dropdown",
  },

  search_input_placeholder: {
    type: String,
    required: false,
    default: "Search ...",
    note: "Placeholder of search input",
  },

  no_results_found_placeholder: {
    type: String,
    required: false,
    default: "No results found",
    note: "Placeholder of no results found",
  },

  maxItem: {
    type: Number,
    required: false,
    default: 10000,
    note: "Max items showing",
  },
  show: {
    type: Boolean,
    default: false,
  },
  error_message: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },

  api_url: { type: String, default: "", required: false },
  hide_search: {
    type: Boolean,
    default: false,
  },

  options_top_size: {
    type: Number,
    default: 22,
  },

  allow_custom: {
    type: Boolean,
    default: false,
  },

  custom_option_label: {
    type: String,
    default: "Use:",
  },
});

const emit = defineEmits(["update:modelValue", "selected", "selectionChanged"]);

const selected = ref({});
const isSelectedOption = ref(false);

const count = ref(0);
const optionsShown = ref(false);
const searchFilter = ref("");
const uuid = ref("");

const isLoading = ref(false);
const page = ref(1);
const lastPage = ref(null);
const firstPage = ref(1);

// shallowRef avoids per-option deep reactivity proxies — large win for big lists
const filteredOptions = shallowRef([]);
const optionsValues = shallowRef([]);
const customOptions = ref([]);

const myDivDropDown = ref(null);
const dropdownRef = ref(null);

// ---------- leak guards / cancellation ----------
let isUnmounted = false;
let activeController = null;     // axios AbortController for in-flight pagination request
let pendingFetchId = 0;          // generation counter — discard stale responses
let searchDebounceTimer = null;

const isAbortError = (err) =>
  err?.name === "CanceledError" ||
  err?.name === "AbortError" ||
  (typeof axios !== "undefined" && axios.isCancel?.(err));


/** Paginated fetch for server-side data, with cancellation + stale-response guard. */
const fetchData = async (direction = "down") => {
  if (isLoading.value || !props.api_url) return;

  // Cancel any in-flight request before starting a new one
  if (activeController) activeController.abort();
  activeController = new AbortController();
  const myFetchId = ++pendingFetchId;

  isLoading.value = true;

  try {
    const currentPage =
      direction === "up" ? Math.max(page.value - 1, firstPage.value) : page.value;
    const { data } = await axios.get(props.api_url, {
      params: { search: searchFilter.value, page: currentPage, per_page: 20 },
      signal: activeController.signal,
    });

    // Drop stale or post-unmount responses
    if (isUnmounted || myFetchId !== pendingFetchId) return;

    if (!data || !data.data) {
      filteredOptions.value = [];
      return;
    }

    const apiData = convertedDataOptions(data.data);

    if (direction === "down") {
      const next = filteredOptions.value.length
        ? filteredOptions.value.concat(apiData)
        : apiData;

      // Re-pin a previously-resolved selection if it isn't on this page
      const sel = selected.value;
      if (
        isObjectNotEmpty(sel) &&
        sel.id !== undefined &&
        sel.name &&
        !next.some((o) => String(o.id) === String(sel.id))
      ) {
        next.unshift(sel);
      }

      filteredOptions.value = next;
      page.value++;
      lastPage.value = data.last_page;
    }

    if (!lastPage.value) lastPage.value = data.last_page;
    if (!firstPage.value) firstPage.value = 1;







   

    
  } catch (error) {
    if (isAbortError(error)) return;
    console.error("Error fetching data:", error);
  } finally {
    if (!isUnmounted && myFetchId === pendingFetchId) {
      isLoading.value = false;
      activeController = null;
    }
  }
};

/** Fetch a single option by id via the existing `search` param. */
const fetchOptionById = async (id) => {
  if (!props.api_url || id === null || id === undefined || id === "") return null;
  try {
    const { data } = await axios.get(props.api_url, {
      params: { search: id, per_page: 20 },
    });
    if (isUnmounted) return null;
    const list = data?.data;
    if (!list || !list.length) return null;
    const idStr = String(id);
    return (
      convertedDataOptions(list).find((o) => String(o.id) === idStr) || null
    );
  } catch (error) {
    if (isAbortError(error)) return null;
    console.error("Error fetching option by id:", error);
    return null;
  }
};

/** Resolve modelValue to a full {id, name} object when using server-side data. */
const resolveServerSelected = async (rawVal) => {
  const id =
    typeof rawVal === "object" && rawVal !== null ? rawVal.id : rawVal;
  if (id === null || id === undefined || id === "") {
    selected.value = {};
    return;
  }
  const idStr = String(id);
  const fromList = filteredOptions.value.find(
    (item) => String(item.id) === idStr
  );
  if (fromList) {
    selected.value = fromList;
    return;
  }
  const fetched = await fetchOptionById(id);
  if (isUnmounted) return;
  if (fetched) {
    selected.value = fetched;
    if (!filteredOptions.value.some((o) => String(o.id) === String(fetched.id))) {
      // shallowRef requires reassignment to trigger reactivity
      filteredOptions.value = [fetched, ...filteredOptions.value];
    }
  } else if (props.allow_custom) {
    selected.value = { id, name: id };
  } else {
    selected.value = { id, name: "" };
  }
};


/** Infinite Scroll Handling */
const handleScroll = (event) => {
  const t = event.target;
  if (!t) return;
  if (
    t.scrollHeight - t.clientHeight <= t.scrollTop + 10 &&
    page.value <= lastPage.value
  ) {
    fetchData("down");
  }
};



const handleFocusChange = (event) => {
  if (!event.target) return;

  if (document.activeElement.classList.contains("showOptions" + uuid.value)) {
    if (!optionsShown.value) {
      showOptions();
    }
  } else {
    if (
      event.target.id != props.field_name + "search" + uuid.value &&
      event.target.id != props.field_name &&
      !event.target.classList.contains("showOptions" + uuid.value)
    ) {
      exit();
      count.value = 0;
      optionsShown.value = false;
    }
  }

  //console.log("Active Element:", document.activeElement);
};

const showOptions = () => {
  if (props.show) return;
  if (optionsShown.value) {
    optionsShown.value = false;
    return;
  }
  searchFilter.value = "";
  optionsShown.value = true;
  if (props.api_url && filteredOptions.value.length === 0) {
    fetchData("down");
  }
  nextTick(() => {
    const el = document.getElementById(
      `${props.field_name}search${uuid.value}`
    );
    if (el) el.focus();
  });
};

const convertedOptionDefault = () => {
  const fallback = (value) => {
    if (props.allow_custom && value) {
      const id = typeof value === "object" ? value.id : value;
      return { id, name: id };
    }
    return {};
  };

  if (isObjectNotEmpty(selected.value)) {
    if (typeof selected.value === "object") {
      return (
        filteredOptions.value.find(
          (item) => String(item.id) === String(selected.value.id)
        ) || fallback(selected.value)
      );
    } else {
      return (
        filteredOptions.value.find(
          (item) => String(item.id) === String(selected.value)
        ) || fallback(selected.value)
      );
    }
  } else if (props.modelValue) {
    if (typeof props.modelValue === "object") {
      return (
        filteredOptions.value.find(
          (item) => String(item.id) === String(props.modelValue.id)
        ) || fallback(props.modelValue)
      );
    } else {
      return (
        filteredOptions.value.find(
          (item) => String(item.id) === String(props.modelValue)
        ) || fallback(props.modelValue)
      );
    }
  } else {
    return {};
  }
};

onMounted(() => {
  uuid.value = generateUUID();
  if (!props.show) {
    document.body.addEventListener("click", clearData);
    document.addEventListener("focusin", handleFocusChange);
  }
});

onBeforeUnmount(() => {
  isUnmounted = true;
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }
  document.body.removeEventListener("click", clearData);
  document.removeEventListener("focusin", handleFocusChange);
});

function searchOptions() {
  const all = optionsValues.value;
  const max = props.maxItem;
  const search = searchFilter.value;
  if (!search) {
    return all.length > max ? all.slice(0, max) : all;
  }
  const needle = search.toLowerCase();
  const filtered = [];
  for (let i = 0, n = all.length; i < n && filtered.length < max; i++) {
    const opt = all[i];
    if (String(opt.name).toLowerCase().includes(needle)) {
      filtered.push(opt);
    }
  }
  return filtered;
}

function handleKeyDown(e) {
  switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
      e.preventDefault();
      selectPost(e.key);
      break;
    case "Enter":
      selectPost(e.key);
      break;
  }
}

function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  let dt = Date.now();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function isObjectNotEmpty(obj) {
  return obj && typeof obj === "object" && Object.keys(obj).length > 0;
}

function clearData(e) {
  if (
    e.target.id != props.field_name + "search" + uuid.value &&
    e.target.id != props.field_name &&
    !e.target.classList.contains("showOptions" + uuid.value)
  ) {
    exit();
    count.value = 0;
    optionsShown.value = false;
  }
}

function scrollToElement(count) {
  const elementId = `${count}${uuid.value}`;
  const element = document.getElementById(elementId);
  const container = dropdownRef.value;
  if (element && container) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (elementRect.top < containerRect.top) {
      container.scrollTop -= containerRect.top - elementRect.top;
    } else if (elementRect.bottom > containerRect.bottom) {
      container.scrollTop += elementRect.bottom - containerRect.bottom;
    }
  }
}

function clickElement(count) {
  const elementId = `${count}${uuid.value}`;
  const element = document.getElementById(elementId);
  if (element) {
    element.click();
  }
}

function selectPost(key) {
  if (key === "ArrowDown" && count.value < filteredOptions.value.length) {
    count.value++;
    scrollToElement(count.value);
  }
  if (key === "ArrowUp" && count.value > 1) {
    count.value--;
    scrollToElement(count.value);
  }
  if (key === "Enter") {
    clickElement(count.value);
  }
}

function convertedDataOptions(arr) {
  const out = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    const opt = arr[i];
    out[i] = typeof opt === "object" ? opt : { id: opt, name: opt };
  }
  return out;
}

function convertedOptions() {
  const arr = props.options;
  const out = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    const opt = arr[i];
    out[i] = typeof opt === "object" ? opt : { id: opt, name: opt };
  }
  return out;
}

function selectCustomOption() {
  const v = searchFilter.value;
  const customOption = { id: v, name: v };
  const idStr = String(v);
  if (!customOptions.value.some((o) => String(o.id) === idStr)) {
    customOptions.value.push(customOption);
  }
  if (!filteredOptions.value.some((o) => String(o.id) === idStr)) {
    // shallowRef requires reassignment to trigger reactivity
    filteredOptions.value = [...filteredOptions.value, customOption];
    optionsValues.value = [...optionsValues.value, customOption];
  }
  selectOption(customOption);
}

function selectOption(option) {
  isSelectedOption.value = true;
  selected.value = option;
  optionsShown.value = false;
  emit("update:modelValue", selected.value.id);
  emit("selected", selected.value);
  emit("selectionChanged", selected.value);
}

function ClearInput() {
  if (!props.show) {
    selected.value = {};
    searchFilter.value = "";
    emit("update:modelValue", "");
    emit("selected", selected.value);
    emit("selectionChanged", selected.value);
    showOptions();
  }
}

function exit() {
  if (!selected.value || !selected.value.id) {
    selected.value = {};
    searchFilter.value = "";
  }
}








// Client mode: filter immediately. Server mode: debounce so we don't fire one
// request per keystroke (cancellation in fetchData also helps).
watch(searchFilter, () => {
  if (!props.api_url) {
    filteredOptions.value = searchOptions();
    if (filteredOptions.value.length === 0) selected.value = {};
    return;
  }
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    searchDebounceTimer = null;
    if (isUnmounted) return;
    page.value = 1;
    lastPage.value = null;
    firstPage.value = 1;
    filteredOptions.value = [];
    fetchData("down");
  }, 250);
});

watch(selected, (newVal) => {
  if (isObjectNotEmpty(newVal) && newVal.id !== props.modelValue) {
    emit("update:modelValue", newVal.id);
  }
});

// api_url change: reset paging state but defer the actual fetch until the
// dropdown is opened (showOptions handles it). Avoids a wasted request when
// the dropdown is mounted but never opened.
watch(
  () => props.api_url,
  () => {
    if (activeController) {
      activeController.abort();
      activeController = null;
    }
    page.value = 1;
    lastPage.value = null;
    firstPage.value = 1;
    filteredOptions.value = [];
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  async (newVal) => {
    if (!newVal) {
      selected.value = {};
      return;
    }
    if (props.api_url) {
      if (!isSelectedOption.value) {
        await resolveServerSelected(newVal);
      } else {
        selected.value = convertedOptionDefault();
      }
    } else {
      selected.value = convertedOptionDefault();
    }
  },
  { immediate: true }
);

watch(
  () => props.options,
  () => {
    if (!props.api_url) {
      const base = convertedOptions();
      const seen = new Set(base.map((o) => String(o.id)));
      const merged = base;
      for (const c of customOptions.value) {
        const cid = String(c.id);
        if (!seen.has(cid)) {
          merged.push(c);
          seen.add(cid);
        }
      }
      optionsValues.value = merged;
      filteredOptions.value = merged;
      selected.value = convertedOptionDefault();
    }
    // In api_url mode the modelValue watch resolves selected — don't clobber it here.
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
