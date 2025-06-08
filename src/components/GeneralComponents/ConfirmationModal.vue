<template>
    <!-- Modal for delete confirmation -->
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto"  role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <!-- Modal overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-500/75" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal content -->
        <div class="inline-block relative overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <!-- Modal header -->
          <div class="px-4 pt-5 pb-4  sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg font-medium leading-6 " >
                  {{ title }}
                </h3>
                <div class="mt-2">

                    <slot/>

                </div>
              </div>
            </div>
          </div>
          <!-- Modal footer -->
          <div class="border-t border-gray-200 rounded-b dark:border-gray-600 px-4 py-3  sm:px-6 flex gap-2">
           
            <!-- Confirm deletion button -->


            <gl-button
             @click="confirmAction"
             tag="button"
             button_type="red"
             
              >{{ button_text }}
            </gl-button>

            <!-- Cancel deletion button -->
            <gl-button
            @click="cancelAction"
             tag="button"
             button_type="light"
             
              > Cancel
            </gl-button>

         
          </div>
        </div>
      </div>
    </div>
</template>

  <script>
  import GlButton from "/src/components/GeneralComponents/GlButton.vue";

  export default {

    components: {
    GlButton,
  },
    props: ['isOpen','title','button_text'],
    methods: {
      confirmAction() {
        this.$emit('confirm-action');
      },
      cancelAction() {
        this.$emit('cancel-action');
      }
    }
  }
  </script>
