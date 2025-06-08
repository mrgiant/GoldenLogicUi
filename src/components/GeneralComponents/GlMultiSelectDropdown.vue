<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>

    <p class="mt-3 mb-4">
      <span
        v-for="(selectedValue, index) in selected"
        class="px-3 py-1 mt-2 mb-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-sm me-2 dark:bg-blue-900 dark:text-blue-300"
        >{{ selectedValue?.name }}</span
      >
    </p>

    <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
  </div>

  <div :class="field_name" v-if="!show">
    <input
      type="hidden"
      :name="field_name + '[]'"
      v-for="(value, index) in selectedIds"
      :key="index"
      :value="value"
    />

    <div class="dropdown" v-if="options">
      <label
        :class="{
          'gl-label-form': error_message == '',
          'gl-label-form-invalid': error_message !== '',
          required: is_required,
        }"
        >{{ label_name }}</label
      >

      <div class="inline-flex ml-2 rounded-md shadow-xs" role="group">
        <button
          @click="selectAll"
          type="button"
          class="px-4 py-0 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 ltr:rounded-tl-lg rtl:rounded-tr-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
        >
          {{ language?.select_all ?? "Select all" }}
        </button>

        <button
          @click="deselectAll"
          type="button"
          class="ltr:rounded-tr-lg rtl:rounded-tl-lg! px-4 py-0 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
        >
          {{ language?.deselect_all ?? "Deselect all" }}
        </button>
      </div>

      <div
        ref="myDivDropDown"
        class="relative border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <div class="relative">
          <!-- Dropdown Input @blur="exit()" -->

          <div
            class="flex flex-wrap gap-2 pr-2 gl-multi-dropdown showOptions"
            @click="showOptions()"
          >
            <span
              v-for="(selectedValue, index) in selected"
              :key="index"
              class="flex gap-2 px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-sm pointer-events-none dark:bg-blue-900 dark:text-blue-300"
              >{{ selectedValue?.name }}
              <i
                @click.stop="clearOption(selectedValue)"
                class="cursor-pointer pointer-events-auto hover:text-red-600 dark:hover:text-red-400"
              >
                <svg
                  class="w-[9px] h-[16px]"
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
                </svg> </i
            ></span>
          </div>

          <i
             @click.stop="showOptions()"
            class="absolute text-xl text-gray-500 cursor-pointer fas ltr:right-2 rtl:left-2 hover:text-gray-700 dark:hover:text-gray-800 showOptions"
            style="top: 13px"
          >
            <svg
              :class="optionsShown ? '' : 'rotate-180'"
              class="w-4 h-4 shrink-0"
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
            class="text-gray-700 bg-white dark:border-strokeDark dark:bg-boxDark dark:text-gray-200 border-b! border-t-0! border-r! border-l! absolute w-full z-999999999 showOptions rounded-b-lg"
            v-show="optionsShown"
           
          >
            <div class="p-1">
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
                  :ref="input_search"
                  :id="`${field_name}search${uuid}`"
                  @keydown="handleKeyDown"
                  @blur="exit()"
                  autocomplete="off"
                  class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  :placeholder="search_input_placeholder"
                />
              </div>
            </div>

            <div class="overflow-y-auto max-h-64">
              <div
                class="block px-2 py-2 text-xs leading-4 text-gray-700 no-underline cursor-pointer dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                @click="selectOption(option)"
                @mousedown="selectOption(option)"
                v-for="(option, index) in filteredOptions"
                :class="
                  index + 1 == count || isOptionSelected(option.id)
                    ? 'bg-gray-100 dark:bg-gray-600'
                    : ''
                "
                :key="index"
                :id="`${index + 1}${uuid}`"
              >
                {{ option.name || option.id || "-" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  defineProps,
  defineEmits,
  onMounted,
  computed,
  nextTick,
  onBeforeUnmount,
} from "vue";

const props = defineProps({
  language: {
    type: Object,
    default: () => {},
  },

  modelValue: {
    type: Array,
    default: [],
  },
  defaultValue: {
    type: Array,
    default: [],
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
    default: "Search",
    note: "Placeholder of search input",
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

  options_top_size: {
    type: Number,
    default: 22,
  },
});

const emit = defineEmits(["update:modelValue", "selected", "selectionChanged"]);
const input_search = ref(null);
const selected = ref([]);
const optionsValues = ref([]);
const selectedIds = ref([]);
const count = ref(0);
const optionsShown = ref(false);
const searchFilter = ref("");
const uuid = ref("");

const myDivDropDown = ref(null);




const preventEnterKey = (e) => {
  if (e.key === "Enter" && e.target.form) {
    e.preventDefault();
  }
};

onMounted(() => {
  uuid.value = generateUUID();

  if (!props.show) {
   

    document.body.addEventListener("click", clearData);
    document.addEventListener("keypress", preventEnterKey);
  }
});

onBeforeUnmount(() => {
 
  document.body.removeEventListener("click", clearData);
  document.removeEventListener("keypress", preventEnterKey);
});

//const optionsValues = computed(() => convertedOptions());
//const selectedDefultValue = computed(() => convertedOptionDefault());

const filteredOptions = computed(() => {
  const filtered = [];
  const regOption = new RegExp(searchFilter.value, "ig");
  for (const option of optionsValues.value) {
    const nameAsString = String(option.name);
    if (searchFilter.value.length < 1 || nameAsString.match(regOption)) {
      if (filtered.length < props.maxItem) filtered.push(option);
    }
  }
  return filtered;
});

function handleKeyDown(e) {
  const keysOfInterest = [
    "ArrowLeft",
    "ArrowUp",
    "ArrowRight",
    "ArrowDown",
    "Enter",
  ];
  if (keysOfInterest.includes(e.key)) {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === "ArrowDown" && props.posts === "") {
      return;
    }

    selectPost(e.key);
  } else {
    // GetSearchSections();
  }
}

function generateUUID() {
  let dt = new Date().getTime();
  const newUUID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return newUUID;
}

function isArrayObjectNotEmpty(items) {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every((item) => typeof item === "object" && item !== null)
  );
}

function isArrayObjects(items) {
  return items.every((item) => typeof item === "object" && item !== null);
}

function isOptionSelected(optionId) {
  return selected.value.findIndex((o) => o.id === optionId) !== -1;
}

function selectAll() {
  selected.value = convertedOptions();
}

function deselectAll() {
  selected.value = [];
  emit("update:modelValue", []);
  emit("selected", []);
  emit("selectionChanged", []);
}

function clearOption(option) {
  let index = selected.value.findIndex((o) => o.id === option.id);
  if (index !== -1) {
    selected.value.splice(index, 1);
  }
  selectedIds.value = selected.value.map((item) => item.id);
  emit("update:modelValue", selectedIds.value);
  emit("selected", selected.value);
  emit("selectionChanged", selected.value);
}

function clearData(e) {
  if (
    e.target.id != props.field_name + "search" + uuid.value &&
    e.target.id != props.field_name &&
    !e.target.classList.contains("showOptions")
  ) {
    exit();
    count.value = 0;
    optionsShown.value = false;
  }
}

function scrollToElement(count) {
  const elementId = `${count}${uuid.value}`;
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView();
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

function convertedOptions() {
  // console.log("convertedOptions");
  return props.options.map((option, index) => {
    if (typeof option === "object") {
      return option;
    } else {
      return { id: option, name: option };
    }
  });
}

function convertedOptionDefault() {
  //console.log("selected.value",selected.value);

  if (isArrayObjectNotEmpty(selected.value)) {
    if (isArrayObjects(selected.value)) {
      return (
        optionsValues.value.filter((option) =>
          selected.value.some(
            (selectedItem) => String(selectedItem.id) === String(option.id)
          )
        ) || []
      );
    } else {
      return (
        optionsValues.value.filter((option) =>
          selected.value.some(
            (selectedItem) => String(selectedItem) === String(option.id)
          )
        ) || []
      );
    }
  } else if (props.modelValue) {
    if (isArrayObjects(props.modelValue)) {
      return (
        optionsValues.value.filter((option) =>
          props.modelValue.some(
            (selectedItem) => String(selectedItem.id) === String(option.id)
          )
        ) || []
      );
    } else {
      return (
        optionsValues.value.filter((option) =>
          props.modelValue.some(
            (selectedItem) => String(selectedItem) === String(option.id)
          )
        ) || []
      );
    }
  }
}

function selectOption(option) {
  let index = selected.value.findIndex((o) => o.id === option.id);
  if (index !== -1) {
    selected.value.splice(index, 1);
  } else {
    selected.value.push(option);
  }

  //selected.value = option;
  optionsShown.value = false;
  selectedIds.value = selected.value.map((item) => item.id);
  emit("update:modelValue", selectedIds.value);
  emit("selected", selected.value);
  emit("selectionChanged", selected.value);
}

function showOptions() {
  if (!props.show) {
    if (optionsShown.value) {
      optionsShown.value = false;

      return;
    }

    searchFilter.value = "";
    optionsShown.value = true;
    nextTick(() => {
     
      //refs[props.field_name + "search" + uuid.value].focus();
      var input_search_feild = document.getElementById(
        `${props.field_name}search${uuid.value}`
      );
      if (input_search_feild) {
        input_search_feild.focus();
      }
      // if(input_search.value)
      //{
      //   input_search.value.focus();
      // }
    });
  }
}

function ClearInput() {
  if (!props.show) {
    selected.value = [];
    searchFilter.value = "";
    emit("update:modelValue", "");
    showOptions();
  }
}

function exit() {
  /*
  if (!selected.value.id) {
    selected.value = [];
    searchFilter.value = "";
  }
  */
  searchFilter.value = "";
  //emit("selected", selected.value);
  // optionsShown.value = false;
}

watch(searchFilter, () => {
  if (filteredOptions.value.length === 0) {
    selected.value = [];
  }
});
watch(selected, (newVal) => {
  if (isArrayObjectNotEmpty(newVal)) {
    // if array newVal

    selectedIds.value = newVal.map((item) => item.id);

    const a = Array.isArray(selectedIds.value) ? selectedIds.value : [];
    const b = Array.isArray(props.modelValue) ? props.modelValue : [];

    if (JSON.stringify(a) !== JSON.stringify(b)) {
      emit("update:modelValue", selectedIds.value);
    }
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    searchFilter.value = "";
    if (newVal) {
      selected.value = props.modelValue;
      selected.value = convertedOptionDefault();
    } else {
      selected.value = {};
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.options,
  () => {
    optionsValues.value = convertedOptions();
    selected.value = convertedOptionDefault();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped></style>
