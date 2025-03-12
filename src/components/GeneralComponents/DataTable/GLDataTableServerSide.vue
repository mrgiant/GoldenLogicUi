<template>
  <DynamicConfirmation ref="ConfirmationDelete"></DynamicConfirmation>
  <div class="p-2">
    <div
      class="flex flex-col flex-wrap gap-4 pb-4 xl:flex-row xl:items-center xl:justify-between"
    >
      <div class="flex items-center gap-2">
        <span class="font-medium"> {{ language?.show ?? "Show" }} </span>

        <div style="margin-top: 3px">
          <dropdown
           :options_top_size="0"
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

        <span class="font-medium"> {{ language?.entries ?? "Entries" }} </span>
      </div>

      <label for="table-search" class="sr-only">Search</label>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 flex items-center pointer-events-none rtl:inset-r-0 rtl:right-0 ps-3"
        >
         
        </div>
        <input
          type="text"
          v-model="search"
          @input="handleSearch()"
          class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :placeholder="
            language?.search ? language?.search + ' ...' : 'Search ...'
          "
        />
      </div>
    </div>

    <div
      class="grid gap-4 mb-3 xs:grid-cols-1 xl:grid-cols-2"
      :class="xprops?.customFiltersMainClass"
    >
      <template v-for="(column, index) in customFilters" :key="index">
        <GlDropdown
          v-if="column.type == 'dropdown'"
          :has_cancel="true"
          :options="column.options"
          v-model="dynamicFilters[column.field_name]"
          :is_required="false"
          :field_name="column.field_name"
          :label_name="column.field_label"
          :show="false"
          :placeholder="
            language?.please_select_an_option ?? 'Please select an option'
          "
        >
        </GlDropdown>

        <GlTextInput
          v-if="column.type == 'text'"
          type="text"
          :is_required="false"
          :show="false"
          v-model="dynamicFilters[column.field_name]"
          :field_name="column.field_name"
          :label_name="column.field_label"
        >
        </GlTextInput>

        <GlTextInput
          v-if="column.type == 'date'"
          type="date"
          :is_required="false"
          :show="false"
          v-model="dynamicFilters[column.field_name]"
          :field_name="column.field_name"
          :label_name="column.field_label"
        >
        </GlTextInput>
      </template>

      <template v-for="(column, index) in columns" :key="index">
        <template
          v-if="
            column.hasOwnFilter && Object.keys(column.hasOwnFilter).length > 0
          "
        >
          <GlDropdown
            v-if="column.hasOwnFilter.type == 'dropdown'"
            :has_cancel="true"
            :options="column.hasOwnFilter.options"
            v-model="dynamicFilters[column.field_name]"
            :is_required="false"
            :field_name="column.field_name"
            :label_name="column.field_label"
            :show="false"
            :placeholder="
              language?.please_select_an_option ?? 'Please select an option'
            "
          >
          </GlDropdown>

          <GlTextInput
            v-if="column.hasOwnFilter.type == 'text'"
            type="text"
            :is_required="false"
            :show="false"
            v-model="dynamicFilters[column.field_name]"
            :field_name="column.field_name"
            :label_name="column.field_label"
          >
          </GlTextInput>

          <GlTextInput
            v-if="column.hasOwnFilter.type == 'date'"
            type="date"
            :is_required="false"
            :show="false"
            v-model="dynamicFilters[column.field_name]"
            :field_name="column.field_name"
            :label_name="column.field_label"
          >
          </GlTextInput>
        </template>
      </template>
    </div>

    <div class="flex flex-wrap mb-3">
      <gl-button
        @click="toggleSelectAll"
        tag="button"
        button_type="default"
        :has_border_reduced="false"
        classes="rounded-s-lg"
      >
        {{ language?.select_all ?? "Select all" }}
      </gl-button>
      <gl-button
        @click="toggleDeselectAll"
        tag="button"
        button_type="default"
        :has_border_reduced="false"
      >
        {{ language?.deselect_all ?? "Deselect all" }}
      </gl-button>
      <gl-button
        tag="button"
        @click="deleteSelected"
        button_type="red"
        :has_border_reduced="false"
        classes="rounded-e-lg"
      >
        {{ language?.delete_selected ?? "Delete selected" }}
      </gl-button>
    </div>

    <div class="overflow-auto rounded-lg dark:text-gray-400 dark:bg-gray-800">
      <table
        class="w-full h-full max-w-full overflow-hidden bg-white border-separate xl:overflow-auto lg:border-collapse border-spacing-y-5 lg:border-spacing-y-0 dark:border-strokedark dark:bg-boxdark"
      >
        <thead
          class="hidden text-sm font-normal text-center text-gray-500 lg:table-header-group dark:border-strokedark bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th class="w-full px-4 py-2 lg:!w-[3%]"></th>

            <th
              v-for="(column, index) in columns"
              :key="index"
              @click="updateSortColumn(column.field_name, column.sortable)"
              class="w-full px-4 py-2 lg:w-2/12"
            >
              {{ column.field_label }}
              <span v-if="sortField === column.field_name" class="ml-2">
                <i v-if="sortOrder === 'asc'" class="fa fa-arrow-up"></i>
                <i v-else class="fa fa-arrow-down"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td :colspan="columns.length">
              <div
                role="status"
                class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div
                      class="w-24 h-3 mb-3 bg-gray-300 rounded-full dark:bg-gray-600"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="w-12 h-3 bg-gray-300 rounded-full dark:bg-gray-700"
                  ></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div
                      class="w-24 h-3 mb-3 bg-gray-300 rounded-full dark:bg-gray-600"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="w-12 h-3 bg-gray-300 rounded-full dark:bg-gray-700"
                  ></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div
                      class="w-24 h-3 mb-3 bg-gray-300 rounded-full dark:bg-gray-600"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="w-12 h-3 bg-gray-300 rounded-full dark:bg-gray-700"
                  ></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div
                      class="w-24 h-3 mb-3 bg-gray-300 rounded-full dark:bg-gray-600"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="w-12 h-3 bg-gray-300 rounded-full dark:bg-gray-700"
                  ></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div
                      class="w-24 h-3 mb-3 bg-gray-300 rounded-full dark:bg-gray-600"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="w-12 h-3 bg-gray-300 rounded-full dark:bg-gray-700"
                  ></div>
                </div>
                <span class="sr-only">Loading...</span>
              </div>
            </td>
          </tr>

          <tr
            v-if="!isLoading"
            v-for="(item, index) in itemLists.data"
            :key="index"
            class="text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:dark:text-gray-200"
          >
            <!-- remove  md:flex-row from  below td to be the text below lable if want in line add it -->

            <td
              class="text-center rounded-t-lg lg:!rounded-t-none text-pretty before:content-[attr(data-label)] before:font-bold lg:before:content-none flex flex-col justify-between gap-2 lg:table-cell py-4 px-5 lg:py-3 lg:px-4 border-[1px] dark:border-gray-700"
              data-label=""
            >
              <input
                :checked="checkedIds.includes(item.id)"
                @change="toggleCheck(item.id)"
                type="checkbox"
                value=""
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </td>

            <td
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              :data-label="column.field_label"
              class="text-pretty before:content-[attr(data-label)] before:font-bold lg:before:content-none flex flex-col justify-between gap-2 lg:table-cell py-4 px-5 lg:py-3 lg:px-4 border-[1px] dark:border-gray-700"
              :class="{
                /* 'rounded-t-lg lg:rounded-t-none': colIndex === 0,*/
                'rounded-b-lg lg:!rounded-b-none':
                  colIndex === columns.length - 1,
              }"
            >
              <div class="overflow-auto max-h-40">
                <component
                  v-if="column.tdComp"
                  :language="language"
                  :is="forDynCompIs(column.tdComp)"
                  :row="item"
                  :field="column.field_name"
                  :xprops="xprops"
                  :tdProps="column.tdProps"
                  @deleteAction="GetItemLists()"
                  @editAction="editAction(item)"
                  @generalAction="generalAction(item)"
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
      class="flex items-center justify-between bg-white border-gray-200 dark:text-gray-400 dark:bg-gray-800"
    >
      <TailwindPagination
        class="mt-3 mb-0"
        classes="px-4 py-3 sm:px-6"
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
import TailwindPagination from "/src/components/LaravelVuePagination/TailwindPagination.vue";

import GlTextInput from "/src/components/GeneralComponents/GlTextInput.vue";
import GlDropdown from "/src/components/GeneralComponents/GlDropdown.vue";
import GlButton from "/src/components/GeneralComponents/GlButton.vue";
import DynamicConfirmation from "/src/components/GeneralComponents/DynamicConfirmation.vue";

import GlToast from "/src/Stores/toast.js";

export default {
  components: {
    TailwindPagination,
    GlTextInput,
    GlDropdown,
    GlButton,
    DynamicConfirmation,
  },
  props: {
    columns: {
      type: Array,
      required: false,
      default: () => [],
    },

    language: {
      type: Object,
      required: false,
      default: () => {},
    },
    data: Array,

    get_item_url: String,
    xprops: Object,
    refreshData: Boolean,
  },
  data() {
    return {
      checkedIds: [],
      dynamicFilters: {},
      isLoading: false,
      isMounted: false,
      limit: 5,
      showDisabled: false,
      size: "default",
      align: "left",
      search: "",
      isDropdownOpen: false,
      itemLists: [],

      tableData: [],

      sortField: this.xprops.defaultSortField
        ? this.xprops.defaultSortField
        : this.columns && this.columns.length > 0
        ? this.columns[0].field_name
        : "",

      sortOrder: "desc",

      pageOptions: [5, 10, 20, 50],
      perPage: 5,
      page: 1,
    };
  },
  emits: ["editAction", "generalAction"],
  computed: {
    columns1() {
      return this.columns;
    },

    filteredData() {
      const searchTerm = this.search.toLowerCase();
      const sortedData = this.sortData(this.data);
      return sortedData.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm)
        );
      });
    },

    customFilters() {
      return this.xprops.customFilters;
    },
  },
  methods: {
    async deleteSelected() {
      if (this.checkedIds.length <= 0) {
        GlToast.methods.add({
          message:
            this.language?.please_select_at_least_one_item_to_delete ??
            "Please select at least one item to delete",
          type: "error",
          duration: 5000,
        });

        return;
      }

      const ok = await this.$refs.ConfirmationDelete.show({
        title:
          this.language?.title_delete_confirmation ?? "Delete Confirmation",
        message:
          this.language?.message_delete_confirmation ??
          "Are you sure you want to delete the selected items?",
        okButton:
          this.language?.okbutton_delete_confirmation ?? "Yes, delete it",
        cancelButton:
          this.language?.cancelbutton_delete_confirmation ?? "Cancel",
      });

      if (ok) {
        this.$refs.ConfirmationDelete.showLoading();

        this.checkedIds.forEach((id) => {
          axios
            .delete(`${this.xprops.route}/${id}`)
            .then(() => {})
            .catch((error) => {
              // handle error
              console.log(error);
            });
        });

        this.checkedIds = [];

        this.$refs.ConfirmationDelete.hideLoading();

        GlToast.methods.add({
          message:
            this.language?.selected_items_deleted_successfully ??
            "Selected items deleted successfully.",
          type: "success",
          duration: 5000,
        });

        this.GetItemLists();
      } else {
        return;
      }
    },

    toggleSelectAll() {
      this.checkedIds = this.itemLists.data.map((item) => item.id);
    },

    toggleDeselectAll() {
      this.checkedIds = [];
    },

    toggleCheck(id) {
      if (this.checkedIds.includes(id)) {
        this.checkedIds = this.checkedIds.filter((item) => item !== id);
      } else {
        this.checkedIds.push(id);
      }
    },

    editAction(data) {
      this.$emit("editAction", data);
    },

    generalAction(data) {
      this.$emit("generalAction", data);
    },
    forDynCompIs(component) {
      return typeof component === "object" ? component : null;
    },
    GetItemLists(page = 1) {
      this.isLoading = true;
      this.page = page;

      const params = {
        sort: this.sortField,
        order: this.sortOrder,
        s: this.search,
        limit: this.perPage,
        page: this.page,
        ...this.dynamicFilters,
      };

      axios
        .get(this.xprops.route_get_data, { params })
        .then((response) => {
          this.itemLists = response.data;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
          this.isLoading = false;
        });
    },

    updateSortColumn(column, sortable) {
      if (!sortable) {
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
      this.sortField =
        this.columns && this.columns.length > 0
          ? this.columns[0].field_name
          : "";
      this.sortOrder = "asc";
      this.page = 1;
      this.GetItemLists(this.page);
    },
  },

  mounted() {
    this.GetItemLists();
    this.isMounted = true;
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
    },

    dynamicFilters: {
      handler(newFilters) {
        this.GetItemLists();
      },
      deep: true,
    },
  },
};
</script>
