<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
    is_open: {
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

    <div
        v-show="is_open"
        tabindex="-1"
        aria-hidden="true"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto"
    >
        <div class="w-full bg-white rounded-lg shadow-xl dark:bg-gray-700" :class="max_width">
            <!-- Modal content -->
            <div class="relative ">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{ title }}
                    </h3>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
                        @click="closeModal"
                    >
                        <svg
                            class="w-3 h-3"
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
                            />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-4 space-y-4 md:p-5">
                    <slot name="body"></slot>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center p-4 border-t border-gray-200 rounded-b md:p-5 dark:border-gray-600">
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








