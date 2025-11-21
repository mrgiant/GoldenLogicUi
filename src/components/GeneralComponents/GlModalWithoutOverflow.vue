<script setup>
import { onMounted, ref, watch,onBeforeUnmount } from "vue";

const props = defineProps({
  is_open: {
    type: Boolean,
    default: false,
  },

  is_loading: {
    type: Boolean,
    default: false,
  },

  has_large_z_index: {
    type: Boolean,
    default: false,
  },

  has_header: {
    type: Boolean,
    default: true,
  },

  has_footer: {
    type: Boolean,
    default: true,
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


onBeforeUnmount(() => {
  removeOverflowStyles();
});




</script>

<template>
  <!-- Main modal -->

  <!-- Modal -->
  <div
    class=" fixed  h-full w-full overflow-y-auto  outline-hidden inset-0 bg-black/80!"
    :class="has_large_z_index ? 'z-9999' : 'z-1055'"
    v-if="is_open"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="pointer-events-none relative  w-auto translate-y-[-50px] transition-all duration-300 ease-in-out min-[576px]:mx-auto mt-7 "
      :class="max_width"
    >

    <div
            class="w-full bg-white rounded-[20px] shadow-sm dark:border md:mt-0  p-2 dark:bg-gray-900 dark:border-gray-800">



      <div
        class="relative flex flex-col w-full text-current bg-white border  outline-hidden pointer-events-auto shadow-4 border-stroke rounded-xl dark:bg-gray-900 dark:border-gray-800"
      >
        <div
          v-if="has_header"
          class="flex items-center justify-between shrink-0 pt-10 pb-3 pl-3 pr-3 border-b-2 dark:border-gray-600"
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
            class="box-content border-none rounded-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-hidden dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
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

        <div
          v-if="is_loading"
          role="status"
          class="max-w-full p-4 border border-gray-200 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700"
        >
          <div
            class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded-sm dark:bg-gray-700"
          >
            <svg
              class="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 20"
            >
              <path
                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"
              />
              <path
                d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"
              />
            </svg>
          </div>
          <div
            class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
          ></div>
          <div
            class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"
          ></div>
          <div
            class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"
          ></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div class="flex items-center mt-4">
            <svg
              class="w-10 h-10 text-gray-200 me-3 dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
              />
            </svg>
            <div>
              <div
                class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"
              ></div>
              <div
                class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
              ></div>
            </div>
          </div>
          <span class="sr-only">Loading...</span>
        </div>

        <!-- Modal body -->
        <div
          v-show="!is_loading"
          class="relative gl_modal_body"
          :class="bodyClass"
        >
          <slot name="body"></slot>
        </div>

        <!-- Modal footer -->
        <div
          v-if="has_footer"
          v-show="!is_loading"
          class="flex flex-wrap items-center justify-end shrink-0 p-4 border-t-2 rounded-b-md border-neutral-100 dark:border-gray-600 gap-2"
        >
          <slot name="buttons"></slot>

          <button
            @click="closeModal"
            type="button"
            class="px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg ms-3 hover:bg-gray-100 focus:ring-4 focus:outline-hidden focus:ring-blue-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Close
          </button>
        </div>
      </div>

      </div>


    </div>
  </div>
</template>
