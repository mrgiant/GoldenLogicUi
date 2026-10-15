<template>
    <!-- Modal for delete confirmation -->
    <div v-if="isOpen" class="fixed inset-0 z-99999 overflow-y-auto"  role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <!-- Modal overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-500/75" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal content -->
        <div ref="panel" tabindex="-1" class="inline-block relative overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full focus:outline-hidden">
          <!-- Modal header -->
          <div class="px-4 pt-5 pb-4  sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 :id="titleId" class="text-lg font-medium leading-6 " >
                  {{ title }}
                </h3>
                <div class="mt-2">

                    <slot/>

                </div>

                <!-- Optional type-to-confirm -->
                <div v-if="confirm_text" class="mt-4 text-left">
                  <label :for="inputId" class="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {{ language?.type_to_confirm ?? 'Type' }}
                    <code class="px-1 py-0.5 font-mono text-red-600 bg-gray-100 rounded-sm dark:bg-gray-900 dark:text-red-300">{{ confirm_text }}</code>
                    {{ language?.to_confirm ?? 'to confirm' }}
                  </label>
                  <input :id="inputId" ref="confirmInput" v-model="typedText" type="text" autocomplete="off"
                    spellcheck="false" class="gl-input-form" @keydown.enter.prevent="confirmAction" />
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
             :is_disabled="!canConfirm"
              >{{ button_text }}
            </gl-button>

            <!-- Cancel deletion button -->
            <gl-button
            ref="cancelButton"
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
  import { ref, watch } from "vue";
  import GlButton from "/src/components/GeneralComponents/GlButton.vue";
  import { useGlFocusTrap, nextGlId } from "/src/components/GeneralComponents/useGlFocusTrap.js";

  export default {

    components: {
    GlButton,
  },
    props: {
      isOpen: null,
      title: null,
      button_text: null,
      // When set, the confirm button stays disabled until exactly this text is typed.
      confirm_text: {
        type: String,
        default: "",
      },
      // Escape emits cancel-action. Set false to only close through the buttons.
      close_on_escape: {
        type: Boolean,
        default: true,
      },
      language: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['confirm-action', 'cancel-action'],
    setup(props, { emit }) {
      const panel = ref(null);
      const confirmInput = ref(null);
      const cancelButton = ref(null);
      const typedText = ref("");

      watch(() => props.isOpen, (open) => {
        if (open) {
          typedText.value = "";
        }
      });

      useGlFocusTrap(panel, () => !!props.isOpen, {
        closeOnEscape: () => props.close_on_escape,
        onEscape: () => emit('cancel-action'),
        initialFocus: () => confirmInput.value || cancelButton.value?.$el || null,
      });

      return {
        panel,
        confirmInput,
        cancelButton,
        typedText,
        titleId: nextGlId("gl-confirmation-title"),
        inputId: nextGlId("gl-confirmation-input"),
      };
    },
    computed: {
      canConfirm() {
        return !this.confirm_text || this.typedText === this.confirm_text;
      },
    },
    methods: {
      confirmAction() {
        if (!this.canConfirm) {
          return;
        }
        this.$emit('confirm-action');
      },
      cancelAction() {
        this.$emit('cancel-action');
      }
    }
  }
  </script>
