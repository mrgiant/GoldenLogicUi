<template>
    <!-- Modal for delete confirmation -->
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto"  role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Modal overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal content -->
        <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <!-- Modal header -->
          <div class="px-4 pt-5 pb-4  sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium leading-6 " >
                  {{ title }}
                </h3>
                <div class="mt-2">


                    <p class="text-sm ">
                       {{ message }}
                  </p>



                </div>
              </div>
            </div>
          </div>
          <!-- Modal footer -->
          <div class="border-t border-gray-200 rounded-b dark:border-gray-600 px-4 py-3  sm:px-6 sm:flex sm:flex-row-reverse">
            <!-- Confirm deletion button -->
            <button @click="confirmAction" type="button" class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                {{ okButton }}
            </button>
            <!-- Cancel deletion button -->
            <button @click="cancelAction" type="button" class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                {{ cancelButton }}
            </button>
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


const title = ref('');
const message = ref('');
const okButton = ref('');
const cancelButton = ref('Cancel');
const isOpen = ref(false);

const resolvePromise = ref(undefined);
const rejectPromise = ref(undefined);









        const show =(opts = {}) =>{
            title.value = opts.title
            message.value = opts.message
            okButton.value = opts.okButton
            if (opts.cancelButton) {
                cancelButton.value = opts.cancelButton
            }
            // Once we set our config, we tell the popup modal to open
            isOpen.value = true;
            // Return promise so the caller can get results
            return new Promise((resolve, reject) => {
                resolvePromise.value = resolve
                rejectPromise.value = reject
            })
        };


        const confirmAction = () => {
            isOpen.value = false;
            resolvePromise.value(true)
        };


        const cancelAction = () => {
            isOpen.value = false;
            resolvePromise.value(false)
        };

        defineExpose({
            show
      });

</script>


