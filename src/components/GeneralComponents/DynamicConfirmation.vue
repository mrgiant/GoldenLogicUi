<template>
  <!-- Modal for delete confirmation -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Modal overlay -->
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 !bg-opacity-75"
        aria-hidden="true"
      ></div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <!-- Modal content -->
      <div
        class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Modal header -->
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg font-medium leading-6">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal footer -->
        <div
          class="flex gap-1 px-4 py-3 border-t border-gray-200 rounded-b dark:border-gray-600 sm:px-6 sm:flex-row-reverse"
        >
          

          <gl-button
              v-if="!isLoading"
            @click="confirmAction"
             tag="button"
             button_type="red"
             
              >{{ okButton }}
            </gl-button>

        <component
        v-else
        is="button"
        disabled
        :class="`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`"
    >
        <svg
            aria-hidden="true"
            role="status"
            class="inline w-4 h-4 me-3 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
            />
        </svg>
        Loading...
    </component>






          <gl-button
            @click="cancelAction"
             tag="button"
             button_type="light"
             
              >{{ cancelButton }}
            </gl-button>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  is_open: {
    type: Boolean,
    default: false,
  },
});

const title = ref("");
const message = ref("");
const okButton = ref("");
const cancelButton = ref("Cancel");
const isOpen = ref(false);
const isLoading = ref(false);
const hasLoading = ref(false);

const resolvePromise = ref(undefined);
const rejectPromise = ref(undefined);

const show = (opts = {}) => {
  title.value = opts.title;
  message.value = opts.message;
  okButton.value = opts.okButton;
  if (opts.cancelButton) {
    cancelButton.value = opts.cancelButton;
  }
  if (opts.hasLoading) {
    hasLoading.value = opts.hasLoading;
  }
  // Once we set our config, we tell the popup modal to open
  isOpen.value = true;
  // Return promise so the caller can get results
  return new Promise((resolve, reject) => {
    resolvePromise.value = resolve;
    rejectPromise.value = reject;
  });
};



const showLoading = () => {
  
  isLoading.value = true;
 

  
};

const hideLoading = () => {
  
  isLoading.value = false;
  isOpen.value = false;
  hasLoading.value = false;
  resolvePromise.value(false);
  
  
};

const confirmAction = () => {
 
  if(hasLoading.value=== true){

    resolvePromise.value(true);
    
    return;
  }

  isOpen.value = false;
  resolvePromise.value(true);
};

const cancelAction = () => {
  isOpen.value = false;
  resolvePromise.value(false);
};

defineExpose({
  show,
  showLoading,
  hideLoading
});
</script>
