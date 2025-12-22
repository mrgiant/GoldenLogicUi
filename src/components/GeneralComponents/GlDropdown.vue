<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>

    <p class="mt-3 mb-4">
      <span
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
            }"
            class="pr-2 showOptions1"
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
                v-if="!isLoading && filteredOptions.length === 0"
                class="p-2 text-gray-500"
              >
                {{
                  no_results_found_placeholder
                }}
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


});

const emit = defineEmits(["update:modelValue", "selected", "selectionChanged"]);
const input_search = ref(null);
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

const filteredOptions = ref([]);
const optionsValues = ref([]);

const myDivDropDown = ref(null);
const dropdownRef = ref(null);





const handleTabPressInput = (event) => {
  console.log("Tab key pressed!", event.key);
  if (event.key === "Tab") {
    event.preventDefault(); // Prevent default tab behavior (optional)
    console.log("Tab key pressed!");
    showOptions();
    // Call your method here
  }
};

/** Fetch Data (Handles Both Scroll Directions) */
const fetchData = async (direction = "down", hasSelectedValue = false) => {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    const currentPage =
      direction === "up" ? Math.max(page.value - 1, firstPage) : page.value;
    const { data } = await axios.get(props.api_url, {
      params: { search: searchFilter.value, page: currentPage, per_page: 20 },
    });

    if (!data || !data.data) {
      isLoading.value = false;
      filteredOptions.value = [];
      return;
    }

    let apiData = convertedDataOptions(data.data);

    if (direction === "down") {
      //filteredOptions.value=[];
      filteredOptions.value.push(...apiData);
      page.value++;
      lastPage.value = data.last_page;
    } else if (direction === "up") {
      // const prevHeight = dropdownRef.value?.scrollHeight || 0;
      //filteredOptions.value.unshift(...apiData);
      //filteredOptions.value.push(...apiData);
      /*
      page.value--;
      await nextTick();
      dropdownRef.value.scrollTop +=
        dropdownRef.value.scrollHeight - prevHeight;
        */
    }

    if (!lastPage.value) lastPage.value = data.last_page;
    if (!firstPage.value) firstPage.value = 1;

    // to add the default selected value if not in the current list

    const defaultOption = convertedOptionDefault();

    

    // 2. Ensure we actually have a selected value to check
    if (defaultOption) {
        
        // 3. Check if this item already exists in the currently loaded options
        // (Assuming 'value' is your unique ID key)
        const existsInList = filteredOptions.value.some(
            (option) => option.value === defaultOption.value
        );

        // 4. If it's NOT in the list, inject it manually
        if (!existsInList) {
            // We unshift (add to top) so the user sees their selection immediately
            filteredOptions.value.unshift(defaultOption);
        }

        // 5. Sync the v-model / internal selected state
        selected.value = defaultOption;

        console.log("Default option added:", defaultOption);
    }







   

    if (hasSelectedValue) {
      searchFilter.value = "";
      filteredOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  isLoading.value = false;
};


/** Infinite Scroll Handling */
const handleScroll = (event) => {
  if (!event.target) return;

  const scrollTop = event.target.scrollTop;
  const bottom =
    event.target.scrollHeight - event.target.clientHeight <= scrollTop + 10;
  const top = scrollTop <= 10;

  if (bottom && page.value <= lastPage.value) {
    fetchData("down");
  }

  if (top && page.value > firstPage.value) {
    // fetchData("up");
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
  if (!props.show) {
    if (optionsShown.value) {
      optionsShown.value = false;

      return;
    }

    searchFilter.value = "";
    optionsShown.value = true;
    if (props.api_url) {
      if (filteredOptions.value.length === 0) {
        fetchData("down");
      }
    }

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
};

const convertedOptionDefault = () => {
  if (isObjectNotEmpty(selected.value)) {
    if (typeof selected.value === "object") {
      return (
        filteredOptions.value.find(
          (item) => String(item.id) === String(selected.value.id)
        ) || {}
      );
    } else {
      return (
        filteredOptions.value.find(
          (item) => String(item.id) === String(selected.value)
        ) || {}
      );
    }
  } else if (props.modelValue) {
    if (typeof props.modelValue === "object") {
      return (
        filteredOptions.value.find(
          (item) => String(item.id) === String(props.modelValue.id)
        ) || {}
      );
    } else {
      return (
        filteredOptions.value.find(
          (item) => String(item.id) === String(props.modelValue)
        ) || {}
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
   // document.addEventListener("keydown", preventEnterKey);
    document.addEventListener("focusin", handleFocusChange);
    
  }
});

onBeforeUnmount(() => {
 
  
  document.body.removeEventListener("click", clearData);
 // document.removeEventListener("keydown", preventEnterKey);
  document.removeEventListener("focusin", handleFocusChange);
  
});

function searchOptions() {
  const filtered = [];
  const safeSearch = searchFilter.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regOption = new RegExp(safeSearch, "ig");
  for (const option of optionsValues.value) {
    const nameAsString = String(option.name);
    if (searchFilter.value.length < 1 || nameAsString.match(regOption)) {
      if (filtered.length < props.maxItem) filtered.push(option);
    }
  }
  return filtered;
}

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
      e.preventDefault(); // Move this to prevent all keys of interest
      
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

/*
function isObjectNotEmpty(obj) {
  return Object.keys(obj).length > 0;
}
*/

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

/*

function scrollToElement(count) {
  const elementId = `${count}${uuid.value}`;
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView();
  }
}

*/


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

function convertedDataOptions(options) {
  return options.map((option, index) => {
    if (typeof option === "object") {
      return option;
    } else {
      return { id: option, name: option };
    }
  });
}

function convertedOptions() {

  return props.options.map((option, index) => {
    if (typeof option === "object") {
      return option;
    } else {
      return { id: option, name: option };
    }
  });
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
  //emit("selected", selected.value);
  
}








watch(searchFilter, (newVal) => {
  if (!props.api_url) {
    filteredOptions.value = searchOptions();
  } else {
    page.value = 1;
    lastPage.value = null;
    firstPage.value = 1;
    filteredOptions.value = [];
    fetchData("down");
  }

  if (filteredOptions.value.length === 0) {
    selected.value = {};
  }
});
watch(selected, (newVal) => {
  if (isObjectNotEmpty(newVal)) {
    if (newVal && newVal.id !== props.modelValue) {
      emit("update:modelValue", newVal.id);
    }
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    //searchFilter.value = "";
    if (newVal) {
      selected.value = props.modelValue;
      if (props.api_url) {
        if (isSelectedOption.value) {
          selected.value = convertedOptionDefault();
        } 

        //selected.value = convertedOptionDefaultApi();
      } else {
        selected.value = convertedOptionDefault();
      }
    } else {
      selected.value = {};
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.options,
  () => {
    if (!props.api_url) {
      filteredOptions.value = optionsValues.value = convertedOptions();
      // filteredOptions.value = searchOptions();
    }

    selected.value = convertedOptionDefault();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped></style>
