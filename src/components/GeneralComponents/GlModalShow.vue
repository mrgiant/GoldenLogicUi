<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  is_open: {
    type: Boolean,
    default: false,
  },

  has_large_z_index: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    default: "",
  },

  max_width: {
    type: String,
    default: "max-w-2xl",
  },

  bodyClass: {
    type: String,
    default: "p-4",
  },
});

const emit = defineEmits(["closeModal"]);

const addOverflowStyles = () => {
  document.documentElement.style.overflow = "hidden";
  document.documentElement.style.paddingRight = "0px";
};

const removeOverflowStyles = () => {
  document.documentElement.style.overflow = "";
  document.documentElement.style.paddingRight = "";
};

const closeModal = () => {
  emit("closeModal");
  removeOverflowStyles();
};

watch(
  () => props.is_open,
  (newValue, oldValue) => {
    if (newValue) {
      addOverflowStyles();
    } else {
      removeOverflowStyles();
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <!-- Main modal -->

  <!-- Modal -->
  <div
    class="fixed left-0 top-13 h-full w-full overflow-y-auto overflow-x-hidden outline-none inset-0 bg-black bg-opacity-80"
    :class="has_large_z_index ? 'z-[9999]' : 'z-[1055]'"
    v-show="is_open"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="pointer-events-none relative h-[calc(100%-1rem)] w-auto translate-y-[-50px] transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:h-[calc(100%-3.5rem)]"
      :class="max_width"
    >
      <div
        class="pointer-events-auto relative flex max-h-[100%] w-full flex-col overflow-hidden text-current shadow-4 outline-none bg-white border rounded-lg border-stroke dark:border-strokedark dark:bg-boxdark"
      >
        <div
          class="flex items-center justify-between flex-shrink-0 pt-10 pb-3 pl-3 pr-3 border-b-2 dark:border-gray-600"
        >
          <!-- Modal title -->
          <h5
            class="text-xl font-medium leading-normal text-surface dark:text-white"
          >
            {{ title }}
          </h5>
          <!-- Close button -->
          <button
            type="button"
            class="box-content border-none rounded-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
            @click="closeModal"
            aria-label="Close"
          >
            <span class="[&>svg]:h-6 [&>svg]:w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </button>
        </div>

        <!-- Modal body -->
        <div class="relative overflow-y-auto" :class="bodyClass">
          <slot name="body"></slot>
        </div>

        <!-- Modal footer -->
        <div
          class="flex flex-wrap items-center justify-end flex-shrink-0 p-4 border-t-2 rounded-b-md border-neutral-100 dark:border-gray-600"
        >
          <slot name="buttons"></slot>

          <button
            @click="closeModal"
            type="button"
            class="px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg ms-3 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
