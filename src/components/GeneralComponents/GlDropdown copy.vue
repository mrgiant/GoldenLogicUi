<template>
    <div :class="field_name" v-if="show">
        <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>

        <p class="mt-3 mb-4">
            <span
                class="bg-blue-100 text-blue-800 text-sm font-medium mb-2 mt-2 me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                >{{ selectedValue.name }}</span
            >
        </p>

        <hr class="!opacity-100 bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <div class="mb-4" :class="field_name" v-if="!show">
        <input
            type="hidden"
            :name="field_name"
            :id="field_name"
            :value="selected.id"
        />

        <div class="dropdown" v-if="options">
            <label
                v-if="label_name"
                :class="{
                    'gl-label-form': error_message == '',
                    'gl-label-form-invalid': error_message !== '',
                    required: is_required,
                }"
                >{{ label_name }}</label
            >

            <div
                class="border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <div class="relative showOptions">
                    <!-- Dropdown Input @blur="exit()" -->

                    <input
                    :class="{
                'gl-input-form': error_message == '',
                'gl-input-form-invalid': error_message !== '',
            }"
                        class="  pl-8 pr-2 showOptions"
                        :ref="field_name"
                        @click="showOptions()"
                        :value="selected.name"
                        :placeholder="placeholder"
                        autocomplete="off"
                        readonly
                    />

                    <i
                        v-show="isObjectNotEmpty(selected) && has_cancel"
                        @click.stop="ClearInput()"
                        class="absolute text-gray-500 cursor-pointer fas fa-times right-7 hover:text-gray-700 dark:hover:text-gray-800"
                        style="top: 13px"
                    ></i>
                    <i
                        @click="!optionsShown && showOptions()"
                        :class="optionsShown ? 'fa-angle-up' : 'fa-angle-down'"
                        class="absolute text-xl text-gray-500 cursor-pointer fas right-2 hover:text-gray-700 dark:hover:text-gray-800 showOptions"
                        style="top: 11px"
                    ></i>
                </div>

                <!-- Dropdown Menu -->
                <div
                    class="text-gray-700 bg-white dark:border-strokedark dark:bg-boxdark dark:text-gray-200 !border-b !border-t-0 !border-r !border-l absolute w-full z-[999999999]"
                    v-show="optionsShown"
                >
                    <div class="p-1">
                        <label
                            for="default-search"
                            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                            >Search</label
                        >
                        <div class="relative">
                            <div
                                class="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3"
                            >
                                <svg
                                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                v-model="searchFilter"
                                :ref="`${field_name}search${uuid}`"
                                :id="`${field_name}search${uuid}`"
                                @keydown="handleKeyDown"
                                @blur="exit()"
                                autocomplete="off"
                                class="block w-full p-2 text-sm text-gray-900 border rounded-lg outline-none border-frontend ps-10 bg-gray-50 focus:border-frontend dark:bg-gray-700 dark:border-frontenddark dark:placeholder-frontenddark dark:text-white dark:focus:border-frontenddark"
                                placeholder="Search ..."
                            />
                        </div>
                    </div>

                    <div class="overflow-y-auto max-h-64">
                        <div
                            class="relative px-2 py-2 text-xs leading-4 text-gray-700 no-underline cursor-pointer dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            @click="selectOption(option)"
                            @mousedown="selectOption(option)"
                            v-for="(option, index) in filteredOptions"
                            :class="
                                index + 1 == count
                                    ? 'bg-gray-100 dark:bg-gray-600'
                                    : ''
                            "
                            :key="index"
                            :id="`${index + 1}${uuid}`"
                        >
                            <div class="flex items-center py-2 pl-10 pr-4">
                                <svg
                                    v-if="selected.id === option.id"
                                    class="absolute flex items-center flex-shrink-0 w-4 h-4 text-green-500 left-2 dark:text-green-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 16 12"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M1 5.917 5.724 10.5 15 1.5"
                                    />
                                </svg>

                                <span
                                    >{{ option.name || option.id || "-" }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <span class="block mt-1 text-sm font-normal leading-5 text-red-500">{{
            error_message
        }}</span>

        <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
    </div>
</template>

<script>
export default {
    name: "Dropdown",
    template: "Dropdown",

    props: {
        modelValue: {
            type: [String, Number],
            default: "",
        },
        default_value: {
            type: [String, Number],
            default: "",
        },
        field_name: {
            type: String,
            default: "",
        },
        is_required: {
            type: Boolean,
            default: false,
        },

        has_cancel: {
            type: Boolean,
            default: true,
        },

        label_name: {
            type: String,
            default: "",
        },
        options: {
            type: Array,
            required: true,
            default: [],
            note: "Options of dropdown. An array of options with id and name",
        },
        placeholder: {
            type: String,
            required: false,
            default: "Please select an option",
            note: "Placeholder of dropdown",
        },

        maxItem: {
            type: Number,
            required: false,
            default: 10000,
            note: "Max items showing",
        },
        show: {
            type: Boolean,
            default: false,
        },

        error_message: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
    },
    emits: ["update:modelValue", "selected","selectionChanged"],
    data() {
        return {
            selected: {},
            count: 0,
            optionsShown: false,
           // options_values: [],
            searchFilter: "",
            uuid: "",
        };
    },
    created() {
        this.$emit("selected", this.selected);
    },
    mounted() {
        this.uuid = this.generateUUID();

        self = this;



        var default_value = this.convertedOptionDefault();

        this.selected =
            this.options_values.find(
                (item) => String(item.id) === String(default_value)
            ) || {};

        if (!this.show) {
            // To clear vue search widget when click on body
            document.body.addEventListener("click", function (e) {
                self.clearData(e);
            });

            document.addEventListener("keypress", function (e) {
                // Check if the pressed key is 'Enter' and if the target element is an input field within a form
                if (e.key === "Enter" && e.target.form) {
                    e.preventDefault();
                    // Additional logic can be added here based on your requirements
                }
            });
        }
    },
    computed: {

        options_values() {
            return this.convertedOptions();
        },


        filteredOptions() {
            const filtered = [];
            const regOption = new RegExp(this.searchFilter, "ig");
            for (const option of this.options_values) {
                const nameAsString = String(option.name); // Convert n.name to a string explicitly.

                if (
                    this.searchFilter.length < 1 ||
                    nameAsString.match(regOption)
                ) {
                    if (filtered.length < this.maxItem) filtered.push(option);
                }
            }
            return filtered;
        },
    },
    methods: {
        handleKeyDown(e) {
            // Define the keys of interest
            const keysOfInterest = [
                "ArrowLeft",
                "ArrowUp",
                "ArrowRight",
                "ArrowDown",
                "Enter",
            ];
            if (keysOfInterest.includes(e.key)) {
                if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                    // Prevent cursor from moving left or right in text input
                    e.preventDefault();
                }

                if (e.key === "ArrowDown" && this.posts === "") {
                    // Placeholder for AJAX call or other logic when Down arrow is pressed and posts are empty

                    return;
                }


                this.selectPost(e.key);
            } else {
                // this.GetSearchSections();
            }
        },

        generateUUID() {
            let dt = new Date().getTime();
            const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    const r = (dt + Math.random() * 16) % 16 | 0;
                    dt = Math.floor(dt / 16);
                    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
                }
            );
            return uuid;
        },

        isObjectNotEmpty(obj) {
            return Object.keys(obj).length > 0;
        },
        clearData: function (e) {
            if (
                e.target.id != this.field_name + "search" + this.uuid &&
                e.target.id != this.field_name &&
                !e.target.classList.contains("showOptions")
            ) {
                this.exit();
                this.count = 0;
            }
        },

        scrollToElement: function (count) {
            const elementId = `${count}${this.uuid}`;
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView();
            }
        },

        clickElement: function (count) {
            const elementId = `${count}${this.uuid}`;
            const element = document.getElementById(elementId);
            if (element) {
                element.click();
            }
        },

        selectPost: function (key) {
            // If down arrow key is pressed
            if (
                key === "ArrowDown" &&
                this.count < this.filteredOptions.length
            ) {
                this.count++;
                this.scrollToElement(this.count);
            }
            // If up arrow key is pressed
            if (key === "ArrowUp" && this.count > 1) {
                this.count--;
                this.scrollToElement(this.count);
            }
            // If enter key is pressed
            if (key === "Enter") {
                // Go to selected post
                this.clickElement(this.count);
            }
        },

        convertedOptions() {


            return this.options.map((option, index) => {

                if (typeof option === "object") {
                    return option; // If it's already an object, leave it as is
                } else {
                    return { id: option, name: option }; // If it's a string, convert it to an object
                }
            });
        },

        convertedOptionDefault() {


            var option = this.default_value || this.modelValue;
            
            if(option)
            {
                if (typeof option === "object") {
                return option.id + ""; // If it's already an object, leave it as is
            } else {
                return option + ""; // If it's a string, convert it to an object
            }
            }
            else
            {
                return "";

            }







        },

        updateModelValue(event) {
            this.$emit("update:modelValue", event.target.value);
        },
        selectOption(option) {
            this.selected = option;
            this.optionsShown = false;

            this.$emit("selected", this.selected);
            this.$emit("selectionChanged", this.selected);
            
        },

        showOptions() {
            if (!this.show) {
                this.searchFilter = "";

                this.optionsShown = true;

                this.$nextTick(() => {
                    this.$refs[this.field_name + "search" + this.uuid].focus();
                });
            }
        },

        ClearInput() {
            if (!this.show) {
                this.selected = {};
                this.searchFilter = "";
                this.$emit("update:modelValue", "");
                this.showOptions();
            }
        },
        exit() {
            if (!this.selected.id) {
                this.selected = {};
                this.searchFilter = "";
            }
            this.$emit("selected", this.selected);
            this.optionsShown = false;
        },
        // Selecting when pressing Enter
    },
    watch: {
        searchFilter() {
            if (this.filteredOptions.length === 0) {
                this.selected = {};
            }
            /*
            else {
              //  this.selected = this.filteredOptions[0];
            }
            */
            //this.$emit("filter", this.searchFilter);
        },

        selected(value) {
            if (this.isObjectNotEmpty(value)) {
                this.$emit("update:modelValue", value.id);
            }
        },

       // options(newOptions) {


            /*
            this.options_values = this.convertedOptions();

            var default_value = this.convertedOptionDefault();
            console.log("default_value_options : ", default_value);

            this.selected =
                this.options_values.find(
                    (item) => String(item.id) === String(default_value)
                ) || {};

                */



       // },
    },
};
</script>

<style lang="scss" scoped></style>
