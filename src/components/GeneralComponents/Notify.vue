<template>
    <div
        v-if="notification.show"
        class="fixed right-0 z-50 flex items-center p-4 m-5 mb-4 rounded-lg shadow-lg"
        :class="alertClasses"
        role="alert"
    >
        <svg
            class="shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
            />
        </svg>
        <span class="sr-only">Info</span>
        <div class="mr-3 text-sm font-medium ms-3">
            {{ notification.message }}
        </div>







        <button
            type="button"
            @click="dismiss"
            class="inline-flex items-center justify-center w-6 h-6 p-1 -mx-1 -my-1 rounded-lg ms-auto focus:ring-2 hover:bg-opacity-50"
            :class="buttonClasses"
            aria-label="Close"
        >
            <span class="sr-only">Close</span>
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
        </button>
    </div>


</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    computed: {
        ...mapState("notification", ["notification"]),
        alertClasses() {
            switch (this.notification.type) {
                case "info":
                    return "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400";
                case "error":
                    return "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400";
                case "success":
                    return "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400";
                case "warning":
                    return "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300";
                case "dark":
                    return "text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-300";
                default:
                    return "";
            }
        },

        buttonClasses() {
            switch (this.notification.type) {
                case "info":
                    return "bg-blue-50 text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:hover:bg-gray-700";
                case "error":
                    return "bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:hover:bg-gray-700";
                case "success":
                    return "bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200 dark:hover:bg-gray-700";
                case "warning":
                    return "bg-yellow-50 text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:hover:bg-gray-700";
                case "dark":
                    return "bg-gray-50 text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700";
                default:
                    return "";
            }
        },
    },
    methods: {
        ...mapMutations("notification", ["HIDE_NOTIFICATION"]),
        dismiss() {
            this.HIDE_NOTIFICATION();
        },
    },
    watch: {
        "notification.show": function (newVal) {
            if (newVal) {
                setTimeout(() => {
                    this.dismiss();
                }, this.notification.duration);
            }
        },
    },
};
</script>
