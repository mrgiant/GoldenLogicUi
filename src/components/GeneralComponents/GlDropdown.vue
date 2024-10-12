<template>
  <div :class="field_name" v-if="show">
    <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>

    <p class="mt-3 mb-4">
      <span
        class="bg-blue-100 text-blue-800 text-sm font-medium mb-2 mt-2 me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
        >{{ selected?.name }}</span
      >
    </p>

    <hr class="!opacity-100 bg-gray-200 border-0 dark:bg-gray-700" />
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
        ref="myDivDropDown"
        class="relative focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <div class="relative showOptions">
          <input
            :class="{
              'gl-input-form': error_message == '',
              'gl-input-form-invalid': error_message !== '',
            }"
            class="pl-8 pr-2 showOptions"
            @click="showOptions()"
            :value="selected?.name"
            :placeholder="placeholder"
            autocomplete="off"
            readonly
          />

          <i
            v-show="isObjectNotEmpty(selected) && has_cancel"
            @click.stop="ClearInput()"
            class="absolute text-gray-500 cursor-pointer  ltr:right-7 rtl:left-7  pointer-events-auto hover:text-red-600 dark:hover:text-red-400"
            style="top: 13px"
          >       <svg class="w-[9px] h-[16px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
      </svg>    </i>
          <i
            @click="showOptions()"
            :class="optionsShown ? 'fa-angle-up' : 'fa-angle-down'"
            class="absolute text-xl text-gray-500 cursor-pointer fas   ltr:right-2 rtl:left-2 hover:text-gray-700 dark:hover:text-gray-800 showOptions"
            style="top: 11px"
          ></i>

          <!-- Dropdown Menu -->
          <div
            class="text-gray-700 bg-white dark:border-strokedark dark:bg-boxdark dark:text-gray-200 !border-b !border-t-0 !border-r !border-l fixed w-full z-[999999999] rounded-b-lg"
            v-show="optionsShown"
            :style="{
              maxWidth: divDropDownWidth + 'px',
              top: divDropDownTop + 'px',
            }"
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
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  v-model="searchFilter"
                  :id="`${field_name}search${uuid}`"
                  @keydown="handleKeyDown"
                  @blur="exit()"
                  autocomplete="off"
                  class="block w-full p-2 text-sm text-gray-900 border rounded-lg outline-none border-primary ps-10 bg-gray-50 focus:border-primary dark:bg-gray-700 dark:border-primaryDark dark:placeholder-primaryDark dark:text-white dark:focus:border-primaryDark"
                  placeholder="Search ..."
                />
              </div>
            </div>

            <div class="overflow-y-auto max-h-64">
              <div
                class="relative px-2 py-2 text-xs leading-4 text-gray-700 no-underline cursor-pointer dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                @click="selectOption(option)"
                @mousedown="selectOption(option)"
                v-for="(option, index) in filteredOptions"
                :class="
                  index + 1 == count ? 'bg-gray-100 dark:bg-gray-600' : ''
                "
                :key="index"
                :id="`${index + 1}${uuid}`"
              >
                <div class="flex items-center py-2 pl-10 pr-4">
                  <svg
                    v-if="selected?.id === option.id"
                    class="absolute flex items-center flex-shrink-0 w-4 h-4 text-green-500 left-2 dark:text-green-400"
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
});

const emit = defineEmits(["update:modelValue", "selected", "selectionChanged"]);
const input_search = ref(null);
const selected = ref({});
const optionsValues = ref([]);
const count = ref(0);
const optionsShown = ref(false);
const searchFilter = ref("");
const uuid = ref("");

const myDivDropDown = ref(null);
const divDropDownWidth = ref(0);
const divDropDownTop = ref(0);

const getDivDropDownWidth = () => {
  if (myDivDropDown.value) {
    divDropDownWidth.value = myDivDropDown.value.offsetWidth;
    var parentRect = myDivDropDown.value.getBoundingClientRect();

    divDropDownTop.value = parentRect.top + 41 + (props.label_name ? 22 : 0) ;

    //label_name
  }
};

const preventEnterKey = (e) => {
  if (e.key === "Enter" && e.target.form) {
    e.preventDefault();
  }
};

onMounted(() => {
  uuid.value = generateUUID();

  //var defaultValue = convertedOptionDefault();

  //selected.value = optionsValues.value.find(item => String(item.id) === String(defaultValue)) || {};

  if (!props.show) {
    window.addEventListener("scroll", getDivDropDownWidth);

    document.body.addEventListener("click", clearData);
    document.addEventListener("keypress", preventEnterKey);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", getDivDropDownWidth);
  document.body.removeEventListener("click", clearData);
  document.removeEventListener("keypress", preventEnterKey);
});

//const optionsValues = computed(() => convertedOptions());
// const selectedDefultValue = computed(() => convertedOptionDefault());

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

/*
function isObjectNotEmpty(obj) {
  return Object.keys(obj).length > 0;
}
*/

function isObjectNotEmpty(obj) {
  return obj !== null && typeof obj === "object" && Object.keys(obj).length > 0;
}

function clearData(e) {



  if (
    e.target.id != props.field_name + "search" + uuid.value &&
    e.target.id != props.field_name &&
    !e.target.classList.contains("showOptions")
  ) 
  {
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
  return props.options.map((option, index) => {
    if (typeof option === "object") {
      return option;
    } else {
      return { id: option, name: option };
    }
  });
}

function convertedOptionDefault() {

  //console.log("convertedOptionDefault ",props.modelValue);
  //console.log("optionsValues.value ",optionsValues.value);
  if (isObjectNotEmpty(selected.value)) {
    if (typeof selected.value === "object") {
      return (
        optionsValues.value.find(
          (item) => String(item.id) === String(selected.value.id)
        ) || {}
      );
    } else {
      return (
        optionsValues.value.find(
          (item) => String(item.id) === String(selected.value)
        ) || {}
      );
    }
  } else if (props.modelValue) {
    
    if (typeof props.modelValue === "object") {
      return (
        optionsValues.value.find(
          (item) => String(item.id) === String(props.modelValue.id)
        ) || {}
      );
    } else {
      return (
        optionsValues.value.find(
          (item) => String(item.id) === String(props.modelValue)
        ) || {}
      );
    }
  }

  /*
  var option = selected.value || props.modelValue;
  console.log(selected.value," - ",props.modelValue," - ",option);
  if (option) {
    if (typeof option === "object") {
       return optionsValues.value.find(item => String(item.id) === String(option.id)) || {};

      return option.id + "";
    } else {
        return optionsValues.value.find(item => String(item.id) === String(option)) || {};
      return option + "";
    }
  } 

  */
}

function selectOption(option) {
  selected.value = option;
  optionsShown.value = false;
  emit("update:modelValue", selected.value.id);
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
      getDivDropDownWidth();
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
    selected.value = {};
    searchFilter.value = "";
    emit("update:modelValue", "");
    showOptions();
  }
}

function exit() {
  if (!selected.value || !selected.value.id) {
    selected.value = {};
    searchFilter.value = "";
  }
  emit("selected", selected.value);
  //optionsShown.value = false;
}

watch(searchFilter, () => {
  if (filteredOptions.value.length === 0) {
    selected.value = {};
  }
});
watch(selected, (value) => {
  if (isObjectNotEmpty(value)) {
    emit("update:modelValue", value.id);
  }
});

watch(
  () => props.modelValue,
  () => {
    if (!isObjectNotEmpty(selected.value)) {
      selected.value = props.modelValue;
      selected.value = convertedOptionDefault();
    }
  },
  { immediate: true ,deep:true}
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
