<template>
    <div :class="field_name" v-if="show">
        <h3 class="font-bold ptext-lg dark:text-white">{{ label_name }}</h3>

        <p class="mt-3 mb-4">
            <span
                v-for="(selectedValue, index) in selected"
                class="bg-blue-100 text-blue-800 text-sm font-medium mb-2 mt-2 me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                >{{ selectedValue.name }}</span
            >
        </p>

        <hr class="!opacity-100 bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <div class="mb-4" :class="field_name" v-if="!show">
        <input
            type="hidden"
            :name="field_name + '[]'"
            v-for="(value, index) in selectedIds"
            :key="index"
            :value="value"
        />

        <div class="dropdown" v-if="options">
            <label
                :class="{
                    'gl-label-form': error_message == '',
                    'gl-label-form-invalid': error_message !== '',
                    required: is_required,
                }"
                >{{ label_name }}</label
            >

            <div class="inline-flex ml-2 rounded-md shadow-sm" role="group">
                <button
                    @click="selectAll"
                    type="button"
                    class="px-4 py-0 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-md hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                    Select all
                </button>

                <button
                    @click="deselectAll"
                    type="button"
                    class="px-4 py-0 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-md hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                    Deselect all
                </button>
            </div>

            <div
                class="border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <div class="relative">
                    <!-- Dropdown Input @blur="exit()" -->

                    <div
                        class="flex flex-wrap gap-2 pl-8 pr-2 gl-multi-dropdown showOptions"
                        @click="showOptions()"
                    >
                        <span
                            v-for="(selectedValue, index) in selected"
                            :key="index"
                            class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded pointer-events-none dark:bg-blue-900 dark:text-blue-300"
                            >{{ selectedValue.name }}
                            <i
                                @click.stop="clearOption(selectedValue)"
                                class="cursor-pointer pointer-events-auto hover:text-red-600 dark:hover:text-red-400 fas fa-times"
                            ></i
                        ></span>
                    </div>

                    <i
                        :class="optionsShown ? 'fa-angle-up' : 'fa-angle-down'"
                        class="absolute text-xl text-gray-500 cursor-pointer fas right-2 hover:text-gray-700"
                        style="top: 11px"
                    ></i>
                </div>

                <!-- Dropdown Menu -->

                <div
                    class="text-gray-700 bg-white dark:border-strokedark dark:bg-boxdark dark:text-gray-200 !border-b !border-t-0 !border-r !border-l absolute w-full z-[999999999] showOptions"
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
                                :id="field_name + 'search'"
                                :ref="field_name + 'search'"
                                @blur="exit()"
                                autocomplete="off"
                                class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search ..."
                            />
                        </div>
                    </div>

                    <div class="overflow-y-auto max-h-64">
                        <div
                            class="block px-2 py-2 text-xs leading-4 text-gray-700 no-underline cursor-pointer dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            @click="selectOption(option)"
                            @mousedown="selectOption(option)"
                            v-for="(option, index) in filteredOptions"
                            :class="
                                index + 1 == count ||
                                isOptionSelected(option.id)
                                    ? 'bg-gray-100 dark:bg-gray-600'
                                    : ''
                            "
                            :key="index"
                            :id="index + 1"
                        >
                            {{ option.name || option.id || "-" }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


export default {
    name: "MultiSelectDropdown",
    template: "MultiSelectDropdown",
    props: {
        modelValue: {
        type: [String,Number],
        default: "",
  },
        default_value: {
            type: Array,
            default: [],
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
            default: 100,
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
    },
    data() {
        return {
            selected: [],
            count: 0,
            optionsShown: false,
           // options_values: [],
            searchFilter: "",
            selectedIds: [],
        };
    },
    created() {
        this.$emit("selected", this.selected);
    },
    mounted() {
        self = this;


        var  default_value = this.convertedOptionsDefault();


        this.selected = this.options_values.filter((option) =>
            default_value.includes(option.id+"")
        );

        if (!this.show) {
            // To clear vue search widget when click on body
            document.body.addEventListener("click", function (e) {
                self.clearData(e);
            });

            document
                .getElementById(this.field_name + "search")
                .addEventListener("keydown", function (e) {
                    // check whether arrow keys are pressed
                    if (_.includes([37, 38, 39, 40, 13], e.keyCode)) {
                        if (e.keyCode === 38 || e.keyCode === 40) {
                            // To prevent cursor from moving left or right in text input
                            e.preventDefault();
                        }

                        if (e.keyCode === 40 && self.posts == "") {
                            // If post list is cleared and search input is not empty
                            // then call ajax again on down arrow key press
                            // self.GetSearchSections();
                            return;
                        }

                        self.selectItem(e.keyCode);
                    } else {
                        // self.GetSearchSections();
                    }
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

 
    emits: ["update:modelValue", "selected","selectionChanged"],

    methods: {
        selectAll() {
            this.selected = this.convertedOptions();
        },
        deselectAll() {
            this.selected = [];
        },

        isOptionSelected(optionId) {
            return this.selected.findIndex((o) => o.id === optionId) !== -1;
        },
        clearData: function (e) {
            if (
                e.target.id != this.field_name + "search" &&
                e.target.id != this.field_name &&
                !e.target.classList.contains("showOptions")
            ) {
                this.exit();
                this.count = 0;
            }
        },

        selectItem: function (keyCode) {
            // If down arrow key is pressed
            if (keyCode == 40 && this.count < this.filteredOptions.length) {
                this.count++;
                document.getElementById(this.count).scrollIntoView();
            }
            // If up arrow key is pressed
            if (keyCode == 38 && this.count > 1) {
                this.count--;

                document.getElementById(this.count).scrollIntoView();
            }
            // If enter key is pressed
            if (keyCode == 13) {
                // Go to selected post
                document.getElementById(this.count).click();
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


        convertedOptionsDefault() {

            return this.default_value.map((option, index) => {
                if (typeof option === "object") {
                    return option.id+""; // If it's already an object, leave it as is
                } else {
                    return option+""; // If it's a string, convert it to an object
                }
            });
        },



        clearOption(option) {
            let index = this.selected.findIndex((o) => o.id === option.id);
            if (index !== -1) {
                this.selected.splice(index, 1);
            }
            this.selectedIds = this.selected.map((item) => item.id);
            this.$emit("update:modelValue", this.selectedIds);

            this.$emit("selected", this.selectedIds);

        },
        selectOption(option) {


            let index = this.selected.findIndex((o) => o.id === option.id);
            if (index !== -1) {
                this.selected.splice(index, 1);
            } else {
                this.selected.push(option);
            }

            // this.optionsShown = false;


            this.selectedIds = this.selected.map((item) => item.id);
            this.$emit("update:modelValue", this.selectedIds);
            this.$emit("selected", this.selectedIds);
        },


        showOptions() {
            if (!this.show) {
                this.searchFilter = "";

                this.optionsShown = true;


                this.$nextTick(() => {
                    this.$refs[this.field_name + "search"].focus();
                });
            }
        },

        ClearInput() {
            if (!this.show) {
                this.selected = [];
                this.searchFilter = "";
                this.showOptions();
            }
        },
        exit() {
            if (!this.selected) {
                this.selected = [];
                this.searchFilter = "";
            }
            // this.$emit("selected", this.selected);
            this.optionsShown = false;
        },
        // Selecting when pressing Enter
        keyMonitor: function (e) {
            // check whether arrow keys are pressed
            if (_.includes([37, 38, 39, 40, 13], e.keyCode)) {
                if (e.keyCode === 38 || e.keyCode === 40) {
                    // To prevent cursor from moving left or right in text input
                    e.preventDefault();
                }

                if (e.keyCode === 40 && self.posts == "") {
                    // If post list is cleared and search input is not empty
                    // then call ajax again on down arrow key press
                    // self.GetSearchSections();
                    return;
                }

                this.selectItem(e.keyCode);
            } else {
                //self.GetSearchSections();
            }
        },
    },
    watch: {
        searchFilter() {
            if (this.filteredOptions.length === 0) {
                // this.selected = [];
            } else {
                // this.selected.push(this.filteredOptions[0]);
            }
            //this.$emit("filter", this.searchFilter);
        },

        selected(value) {
            this.selectedIds = value.map((item) => item.id);
            this.$emit("update:modelValue", this.selectedIds);

            this.$emit("selected", this.selectedIds);
            this.$emit("selectionChanged", this.selectedIds);
        },
    },
};
</script>

<style lang="scss" scoped></style>
