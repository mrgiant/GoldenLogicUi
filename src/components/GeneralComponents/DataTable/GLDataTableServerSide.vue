<template>
    <div class="p-2">
        <div
            class="flex flex-col flex-wrap pb-4 space-y-4 xl:flex-row xl:items-center xl:justify-between flex-column sm:space-y-0"
        >
            <div class="flex items-center gap-2">
                <span class="font-medium"> Show </span>

                <div style="margin-top: 9px">
                    <dropdown
                        :has_cancel="false"
                        :options="pageOptions"
                        v-model="perPage"

                        :is_required="false"
                        field_name="perPage"
                        label_name=""
                        :default_value="5"
                        :show="false"
                        placeholder="Please select an option"
                    >
                    </dropdown>
                </div>

                <span class="font-medium"> Entries </span>
            </div>

            <label for="table-search" class="sr-only">Search</label>
            <div class="relative">
                <div
                    class="absolute inset-y-0 left-0 flex items-center pointer-events-none rtl:inset-r-0 rtl:right-0 ps-3"
                >
                    <svg
                        class="w-5 h-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
                <input
                    type="text"
                    v-model="search"
                    @input="handleSearch()"
                    class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search ..."
                />
            </div>
        </div>

        <div
            class="overflow-auto rounded-lg dark:text-gray-400 dark:bg-gray-800"
        >
            <table
                class="w-full h-full max-w-full overflow-hidden bg-white border-separate xl:overflow-auto lg:border-collapse border-spacing-y-3 lg:border-spacing-y-0 dark:border-strokedark dark:bg-boxdark"
            >
                <thead
                    class="hidden text-sm font-normal text-center text-gray-700 uppercase lg:table-header-group dark:border-strokedark bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                    <tr>
                        <th
                            v-for="(column, index) in columns"
                            :key="index"
                            @click="updateSortColumn(column.field_name,column.sortable)"
                            class="w-full px-4 py-2 lg:w-2/12"
                        >
                            {{ column.field_label }}
                            <span
                                v-if="sortField === column.field_name"
                                class="ml-2"
                            >
                                <i
                                    v-if="sortOrder === 'asc'"
                                    class="fa fa-arrow-up"
                                ></i>
                                <i v-else class="fa fa-arrow-down"></i>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in itemLists.data"
                        :key="index"
                        class="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        <td
                            v-for="(column, colIndex) in columns"
                            :key="colIndex"
                            :data-label="column.field_label"
                            class="text-pretty before:content-[attr(data-label)] before:font-bold lg:before:content-none flex md:flex-row flex-col justify-between gap-2 lg:table-cell py-4 px-5 lg:py-2.5 lg:px-4 border dark:border-gray-700"
                        >
                        <div class="overflow-auto max-h-40">
                            <component
                                v-if="column.tdComp"
                                :is="forDynCompIs(column.tdComp)"
                                :row="item"
                                :field="column.field_name"
                                :xprops="xprops"
                                :tdProps="column.tdProps"
                                @deleteAction="GetItemLists()"
                            >
                            </component>
                            <template v-else>
                                {{ item[column.field_name] }}
                            </template>
                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            class="flex items-center justify-between px-4 py-3 bg-white border-gray-200 sm:px-6 dark:text-gray-400 dark:bg-gray-800"
        >
            <TailwindPagination
                class="mt-3 mb-0"
                :data="itemLists"
                :limit="limit"
                :size="size"
                :align="align"
                @pagination-change-page="GetItemLists"
            />
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import TailwindPagination from "../../LaravelVuePagination/TailwindPagination.vue";
export default {
    components: { TailwindPagination },
    props: {
        data: Array,
        columns: Array,
        get_item_url: String,
        xprops: Object,
        refreshData: Boolean,
    },
    data() {
        return {
            isMounted: false,
            limit: 5,
            showDisabled: false,
            size: "default",
            align: "left",
            search: "",
            isDropdownOpen: false,
            itemLists: [],

            tableData: [],
            sortField: this.columns[0].field_name,
            sortOrder: "asc",

            pageOptions: [5, 10, 20, 50],
            perPage: 5,
            page: 1,
        };
    },
    computed: {
        filteredData() {
            const searchTerm = this.search.toLowerCase();
            const sortedData = this.sortData(this.data);
            return sortedData.filter((item) => {
                return Object.values(item).some((value) =>
                    value.toString().toLowerCase().includes(searchTerm)
                );
            });
        },
    },
    methods: {
        forDynCompIs(component) {

            //  return typeof component === 'object' ? component : DatatablePictures;
            return typeof component === "object"
                ? component
                : defineAsyncComponent({
                      loader: () => import(`../${component}.vue`),
                  });
        },
        GetItemLists(page = 1) {
            this.page = page;

            const params = {
                sort: this.sortField,
                order: this.sortOrder,
                s: this.search,
                limit: this.perPage,
                page: this.page,
            };

            /*
            if (!this.is_search) {
                this.is_loading = true;
            }

            */
            axios
                .get(this.xprops.route_get_data, { params })
                .then((response) => {
                    this.itemLists = response.data;

                    // this.is_loading = false;
                    // this.is_search = false;
                })
                .catch((error) => {
                    console.error(error);
                    //this.is_loading = false;
                    //this.is_search = false;
                });
        },

        updateSortColumn(column,sortable) {

            if(!sortable)
            {
                return;
            }




            if (column === this.sortField) {
                this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
            } else {
                this.sortField = column;
                this.sortOrder = "asc";
            }
            this.GetItemLists(this.page);
        },
        handleSearch() {
            this.sortField = this.columns[0].field_name;
            this.sortOrder = "asc";
            this.page = 1;
            this.GetItemLists(this.page);
        },


    },

    beforeDestroy() {
        // Remove the event listener to prevent memory leaks
       // document.body.removeEventListener("click", this.closeBoxOnbodyClick);
    },
    mounted() {
        this.GetItemLists();
        this.isMounted = true;
       // document.body.addEventListener("click", this.closeBoxOnbodyClick);

    },

    watch: {
        searchFilter() {
            if (this.filteredOptions.length === 0) {
                this.selected = {};
            } else {
                this.selected = this.filteredOptions[0];
            }
            //this.$emit("filter", this.searchFilter);
        },

        perPage(value) {
            this.page = 1;

            this.perPage = value;
            this.GetItemLists(this.page);
        },

        refreshData(newVal, oldVal) {
      if (this.isMounted && newVal !== oldVal) {
        this.GetItemLists();
      }
    }
    },
};
</script>