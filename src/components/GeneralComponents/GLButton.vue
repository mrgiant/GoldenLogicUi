<template>
    <component
        v-if="!actualLoading"
        :is="tag"
        :type="is_submit"
        :disabled="is_disabled"
        v-bind="{ type: is_submit ? 'submit' : undefined }"
        :href="tag === 'a' ? href : undefined"
        :class="`  ${is_disabled ? 'cursor-not-allowed opacity-50':''}   ${icon || svg_icon ? 'flex':''}    h-[2.5rem]  items-center gap-2 focus:outline-hidden text-sm px-3 py-2   font-medium   ${has_border_reduced ? 'rounded-lg':''}  ${buttonTypeClass} ${classes}`"
    >
        <i v-if="icon" :class="icon" class="text-base"></i>
       
        <span v-else-if="svg_icon" v-html="svg_icon" class="w-4 h-4"></span>
        <slot></slot>
    </component>

    <component
        v-else
        is="button"
        disabled
        :class="` opacity-50 h-[2.5rem] flex items-center justify-center focus:outline-hidden text-sm px-6  py-2   font-medium ${has_border_reduced ? 'rounded-lg':''}  ${buttonTypeClass} ${classes}`"
    >
        <svg
            aria-hidden="true"
            role="status"
            class="inline w-5 h-5  animate-spin fill-primary dark:fill-primaryDark"
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
                fill="currentFill"
            />
        </svg>
        
    </component>
</template>
<script>
export default {
    props: {


        classes: {
            type: String,
            default: "",
        },


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

        icon: {
            type: String,
            default: "",
        },

        svg_icon: {
            type: String,
            default: "",
        },

        is_loading: {
            type: Boolean,
            default: false,
        },
        

        is_disabled: {
            type: Boolean,
            default: false,
        },

        has_border_reduced: {
            type: Boolean,
            default: true,
        },


        tag: {
            type: String,
            default: "button",
        },
        href: {
            type: String,
            default: "",
        },

        form_id: {
            type: String,
            default: "",
        },

    },
    data() {
        return {
            internal_loading: false,
        };
    },
    mounted() {
        if (this.form_id) {
            this.attachFormListener();
        }
    },
    beforeUnmount() {
        if (this.form_id) {
            this.detachFormListener();
        }
    },
    computed: {
        buttonTypeClass() {


            switch (this.button_type) {
                case "default":
                    return "text-white bg-blue-700 hover:bg-blue-800        dark:bg-blue-600 dark:hover:bg-blue-700";
                case "alternative":
                    return "      text-gray-900  bg-white  border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";
                case "dark":
                    return "text-white bg-gray-800 hover:bg-gray-900        dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700";
                case "light":
                    return "text-gray-900 bg-white border border-gray-300  hover:bg-gray-100        dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600";
                case "green":
                    return " text-white bg-green-700 hover:bg-green-800        dark:bg-green-600 dark:hover:bg-green-700";
                case "red":
                    return " text-white bg-red-700 hover:bg-red-800        dark:bg-red-600 dark:hover:bg-red-700";
                case "yellow":
                    return " text-white bg-yellow-400 hover:bg-yellow-500";
                case "purple":
                    return " text-white bg-purple-700 hover:bg-purple-800       dark:bg-purple-600 dark:hover:bg-purple-700";
                case "primary":
                    return "text-white gl-btn-primary";
                default:
                    return "";
            }
        },
        actualLoading() {
            return this.is_loading || this.internal_loading;
        },
    },
    methods: {
        attachFormListener() {
            const form = document.getElementById(this.form_id);
            if (form) {
                form.addEventListener('submit', this.handleFormSubmit);
            }
        },
        detachFormListener() {
            const form = document.getElementById(this.form_id);
            if (form) {
                form.removeEventListener('submit', this.handleFormSubmit);
            }
        },
        handleFormSubmit() {
            this.internal_loading = true;
        },
    },
};
</script>

