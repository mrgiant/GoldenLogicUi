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
        ></div>
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
        v-print="printObj"
        tag="button"
        button_type="default"
        :has_border_reduced="false"
        classes="rounded-s-lg"
      >
        {{ language?.print ?? "Print" }}
      </gl-button>


      <gl-button
        @click="exportToExcel"
        tag="button"
        button_type="default"
        :has_border_reduced="false"
        :classes="!enable_select_deselect_delete ? 'rounded-e-lg' : ''"
      >
        {{ language?.excel ?? "Excel" }}
      </gl-button>

      <gl-button
        v-if="enable_select_deselect_delete"
        @click="toggleSelectAll"
        tag="button"
        button_type="default"
        :has_border_reduced="false"
      >
        {{ language?.select_all ?? "Select all" }}
      </gl-button>
      <gl-button
       v-if="enable_select_deselect_delete"
        @click="toggleDeselectAll"
        tag="button"
        button_type="default"
        :has_border_reduced="false"
      >
        {{ language?.deselect_all ?? "Deselect all" }}
      </gl-button>
      <gl-button
        v-if="enable_select_deselect_delete"
        tag="button"
        @click="deleteSelected"
        button_type="red"
        :has_border_reduced="false"
        classes="rounded-e-lg"
      >
        {{ language?.delete_selected ?? "Delete selected" }}
      </gl-button>
    </div>

    <div
      :id="'print_'+Random_string"
      class="overflow-auto rounded-lg dark:text-gray-400 dark:bg-gray-800"
    >
      <table
        :id="'table'+Random_string"
        class="w-full h-full max-w-full overflow-hidden bg-white border-separate xl:overflow-auto lg:border-collapse print:border-collapse! border-spacing-y-5 lg:border-spacing-y-0 print:border-spacing-y-0! dark:border-strokeDark dark:bg-boxDark"
      >
        <thead
          class="hidden text-sm font-normal text-center text-gray-500 print:table-header-group! lg:table-header-group dark:border-strokeDark bg-gray-50 dark:bg-gray-700 dark:text-gray-400 print:border-[1px]!"
        >
          <tr>
            <th  v-if="enable_select_deselect_delete" class="w-full px-4 py-2 lg:w-[3%]! print:hidden!"></th>

            <th
              v-for="(column, index) in visibleColumns"
              :key="index"
              @click="updateSortColumn(column.field_name, column.sortable)"
              class="w-full px-4 py-2 lg:w-2/12 print:w-2/12! print:border-[1px]!"
              :class="{
                'no-print':
                  column.field_name === 'Action' ||
                  column.field_name === 'action',
              }"
            >
              {{ column.field_label }}
              <span
                v-if="sortField === column.field_name"
                class="ml-2 print:hidden!"
              >
                <i v-if="sortOrder === 'asc'" class="fa fa-arrow-up"></i>
                <i v-else class="fa fa-arrow-down"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td :colspan="columns.length+(enable_select_deselect_delete?1:0)">
              <div
                role="status"
                class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
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
            class="text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            <!-- remove  md:flex-row from  below td to be the text below lable if want in line add it -->

            <td
              v-if="enable_select_deselect_delete"
              class="print:hidden! text-center rounded-t-lg lg:rounded-t-none! print:!!rounded-t-none text-pretty before:content-[attr(data-label)] before:font-bold lg:before:content-none print:before:content-none! flex flex-col justify-between gap-2 lg:table-cell py-4 px-5 lg:py-3 lg:px-4 print:py-3! print:px-4! border-[1px] dark:border-gray-700"
              data-label=""
            >
              <input
                :checked="checkedIds.includes(item.id)"
                @change="toggleCheck(item.id)"
                type="checkbox"
                value=""
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </td>

            <td
              v-for="(column, colIndex) in visibleColumns"
              :style="column?.style"
              :key="colIndex"
              :data-label="column.field_label"
              class="text-pretty before:content-[attr(data-label)] before:font-bold lg:before:content-none print:before:content-none! flex flex-col justify-between gap-2 lg:table-cell print:table-cell! py-4 px-5 lg:py-3 lg:px-4 print:py-3! print:px-4! border-[1px] dark:border-gray-700"
              :class="{
                /* 'rounded-t-lg lg:rounded-t-none': colIndex === 0,*/
                'rounded-b-lg lg:rounded-b-none!':
                  colIndex === columns.length - 1,
                'no-print':
                  column.field_name === 'Action' ||
                  column.field_name === 'action',
              }"
            >
              <div  

              :class="column.field_name === 'Action' ||
                column.field_name === 'action'
                ? ''
                : 'overflow-auto'"
              
              class=" td_overflow_auto max-h-40">
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
import print from "vue3-print-nb";
import * as XLSX from 'xlsx';

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

    enable_select_deselect_delete: {
      type: Boolean,
      required: false,
      default: true,
    },


    data: Array,

    get_item_url: String,
    xprops: Object,
    refreshData: Boolean,
  },
  data() {

    const randomString = this.generateRandomString(6);


    return {
      Random_string: randomString,
      printObj: {
        id: "print_"+randomString,
        popTitle: "",
        // preview:true,
      },
      checkedIds: [],
      dynamicFilters: {},
      dynamicQueryString: {},
      isLoading: false,
      isMounted: false,
      limit: 5,
      showDisabled: false,
      size: "default",
      align: "left",
      search: "",
      isDropdownOpen: false,
      itemLists: [],

      
      columnsHidden: [],

      tableData: [],

      sortField: this.xprops.defaultSortField
        ? this.xprops.defaultSortField
        : this.columns && this.columns.length > 0
        ? this.columns[0].field_name
        : "",

      sortOrder: "desc",

      pageOptions: [5, 10, 20, 50,100,200,300,400,500,600,700,800,900,1000],
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


    visibleColumns() {
    return this.columns.filter(
      (column) => !this.columnsHidden.includes(column.field_name)
    );
  }

   

  },
  methods: {

    setDynamicQueryString(queryString) {
      this.dynamicQueryString = queryString;
    },

    generateRandomString(stringLength) {
            let result = "";
            const alphaNumericCharacters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const alphabetsLength = alphaNumericCharacters.length;
            for (let i = 0; i < stringLength; i++) {
                result += alphaNumericCharacters.charAt(
                    Math.floor(Math.random() * alphabetsLength)
                );
            }
            return result;
        },



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
        hasLoading: true,
      });

      if (ok) {

        
       this.$refs.ConfirmationDelete.showLoading();

       this.isLoading = true;



        for (const id of this.checkedIds) {
      //try {
        await axios
          .delete(`${this.xprops.route}/${id}`)
          .then(() => {
          
            
          })
          .catch((error) => {
          
            console.log(`Error deleting item with ID ${id}:`, error);
          });
    
    }

       

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
        ...this.dynamicQueryString,
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


    exportToExcel() {
      // Get the table element
      const table = document.querySelector('#table'+this.Random_string);
      
      // Get the headers from <thead>
        const headers = Array.from(table.querySelectorAll('thead th'))
        .map((th) => th.innerText);

      // Define a list of headers to exclude (e.g., "Name", "City", etc.)
      const headersToExclude = ['Action']; // Add the headers you want to exclude

      // Exclude the first column (header + its data)
      const headersToExcludeWithFirstColumn = ['', ...headersToExclude];

      // Find the indices of columns to exclude based on header names
      const excludeIndices = headers
        .map((header, index) => (headersToExcludeWithFirstColumn.includes(header) ? index : -1))
        .filter((index) => index !== -1);

      // Get the rows from <tbody>
      const rows = Array.from(table.querySelectorAll('tbody tr')).map((tr) => {
        const cells = Array.from(tr.querySelectorAll('td'))
          .map((td) => td.innerText); // Keep the cell value as is, without modifying it
        
        // Remove the cells that correspond to the excluded columns
        return cells.filter((_, index) => !excludeIndices.includes(index));
      });

      // Remove the excluded headers from the header array
      const filteredHeaders = headers.filter((_, index) => !excludeIndices.includes(index));

      // Combine the filtered headers and rows into one array
      const data = [filteredHeaders, ...rows];

      // Convert the array into a worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);

      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Set the file name for the export
      const fileName = 'exported-file.xlsx';

      // Trigger the download of the Excel file
      XLSX.writeFile(wb, fileName);
      
    },


    handleBeforePrint() {
      console.log('User is about to print!');
      // You could update your component's state here

      this.columnsHidden=["Action"];
    },
    handleAfterPrint() {
      console.log('User finished printing!');

      this.columnsHidden=[];
    }

  },

  mounted() {
    this.GetItemLists();
    this.isMounted = true;

    window.addEventListener('beforeprint', this.handleBeforePrint);
    window.addEventListener('afterprint', this.handleAfterPrint);
  },


  
  beforeDestroy() {
    window.removeEventListener('beforeprint', this.handleBeforePrint);
    window.removeEventListener('afterprint', this.handleAfterPrint);
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
  directives: {
    print,
  },
};
</script>

<style scoped>
@media print {
  @page {
    size: A4 landscape;
    
  }

  .no-print {
    display: none !important;
  }
  

 
  table tr {
    page-break-inside: avoid;
  }
  table tr td {
    page-break-inside: avoid;
  }
  .td_overflow_auto {
        overflow: visible !important;
        max-height: none !important;
  }
}
</style>
