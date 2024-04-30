<template>
    <component
        v-if="!is_loading"
        :is="tag"
        :type="is_submit"
        v-bind="{ type: is_submit ? 'submit' : undefined }"
        :href="tag === 'a' ? href : undefined"
        :class="`flex items-center gap-2 focus:outline-none text-sm px-5 py-2 me-2  font-medium rounded-lg  ${buttonTypeClass}`"
    >
        <i v-if="icon" :class="icon" class="text-base"></i>
        <slot></slot>
    </component>

    <component
        v-else
        is="button"
        disabled
        :class="`flex items-center gap-2 focus:outline-none text-sm px-2  py-2 me-2  font-medium rounded-lg  ${buttonTypeClass}`"
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
</template>
<script>
export default {
    props: {
        button_type: {
            type: String,
            default: "default",
        },

        is_submit: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
            default: "",
        },

        is_loading: {
            type: Boolean,
            default: false,
        },
        tag: {
            type: String,
            default: "button",
        },
        href: {
            type: String,
            default: "",
        },

    },
    computed: {
        buttonTypeClass() {


            switch (this.button_type) {
                case "default":
                    return "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300        dark:bg-blue-600 dark:hover:bg-blue-700  dark:focus:ring-blue-800";
                case "alternative":
                    return "      text-gray-900  bg-white  border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";
                case "dark":
                    return "text-white bg-gray-800 hover:bg-gray-900  focus:ring-4 focus:ring-gray-300        dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700";
                case "light":
                    return "text-gray-900 bg-white border border-gray-300  hover:bg-gray-100 focus:ring-4 focus:ring-gray-100        dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700";
                case "green":
                    return " text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300        dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
                case "red":
                    return " text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300        dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";
                case "yellow":
                    return " text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300        dark:focus:ring-yellow-900";
                case "purple":
                    return " text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300       dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900";
                default:
                    return "";
            }
        },
    },
    methods: {},
};
</script>
./GlButton.vue