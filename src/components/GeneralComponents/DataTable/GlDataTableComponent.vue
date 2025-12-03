<template>
  <div class="p-0">
     <button ref="hiddenPrintBtn" v-print="printObj" style="display: none"></button>
    <div
      class="flex flex-col flex-wrap gap-4 pb-4 xl:flex-row xl:items-center xl:justify-between"
    >
      <div class="flex items-center gap-2">
        <span class="font-medium"> Show </span>

        <div class="mt-[9px]">
          <dropdown
            :has_cancel="false"
            :options="showNoOfEntries"
            v-model="itemsPerPage"
            :is_required="false"
            field_name="NoOfEntries"
            label_name=""
            :default_value="10"
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
         
        </div>
        <input
          type="text"
          v-model="search"
          class="gl-input-form"
          placeholder="Search ..."
        />
      </div>
    </div>


    <div class="flex flex-wrap mb-3">
      <gl-button @click="delayedPrint" tag="button" :is_loading="isLoadinPrint" button_type="default"
        :has_border_reduced="false" classes="rounded-s-lg">
        {{ language?.print ?? "Print" }}
      </gl-button>


      <gl-button @click="exportToExcel" tag="button" button_type="default" :has_border_reduced="false"
        classes="rounded-e-lg">
        {{ language?.excel ?? "Excel" }}
      </gl-button>

      </div>

    <div :id="'print_' + Random_string" class="overflow-auto rounded-lg dark:text-gray-400 dark:bg-gray-800">
      <table :id="'table' + Random_string"
        class="w-full h-full max-w-full overflow-hidden bg-white border-separate xl:overflow-auto lg:border-collapse print:border-collapse! border-spacing-y-5 lg:border-spacing-y-0 print:border-spacing-y-0! dark:border-gray-800 dark:bg-gray-900"
      >
        <thead
          class="hidden text-sm font-normal text-center text-gray-600 print:table-header-group! lg:table-header-group dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 print:border-[1px]!"
        >
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              @click="sort(column.field_name, column.sortable)"
              class="w-full px-4 py-2 lg:w-2/12 print:w-2/12! print:border-[1px]!"
            >


            <div class="inline-flex items-center justify-center gap-1">
              <span>{{ column.field_label }}</span>
              <span v-if="sortKey === column.field_name" class="print:hidden!">
                 <svg class="w-4 h-4"  aria-hidden="true" xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24">
                 <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4"/>
                 </svg>

              </span>
              </div>

            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900">
          <tr v-if="isLoading">
            <td :colspan="columns.length">
              <div
                role="status"
                class=" p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div
                      class="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-3"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="h-3 bg-gray-300 rounded-full dark:bg-gray-700 w-12"
                  ></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div
                      class="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-3"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="h-3 bg-gray-300 rounded-full dark:bg-gray-700 w-12"
                  ></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div
                      class="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-3"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="h-3 bg-gray-300 rounded-full dark:bg-gray-700 w-12"
                  ></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div
                      class="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-3"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="h-3 bg-gray-300 rounded-full dark:bg-gray-700 w-12"
                  ></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div
                      class="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-3"
                    ></div>
                    <div
                      class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"
                    ></div>
                  </div>
                  <div
                    class="h-3 bg-gray-300 rounded-full dark:bg-gray-700 w-12"
                  ></div>
                </div>
                <span class="sr-only">Loading...</span>
              </div>
            </td>
          </tr>

          <tr
            v-if="!isLoading"
            v-for="(item, index) in paginatedData"
            :key="index"
            class="text-gray-500   dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >

          <!-- remove  md:flex-row from  below td to be the text below lable if want in line add it -->
            <td
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              :data-label="column.field_label"
              class="text-pretty  before:content-[attr(data-label)] before:font-bold dark:before:text-gray-400 lg:before:content-[''] print:before:content-['']! flex flex-col justify-between gap-2 lg:table-cell print:table-cell! py-4 px-5 lg:py-3 lg:px-4 print:py-3! print:px-4! border-[1px]! dark:border-gray-700"

              :class="{
                 'rounded-t-lg lg:rounded-t-none!': colIndex === 0,
                'rounded-b-lg lg:rounded-b-none!':
                  colIndex === columns.length - 1,

              }"
            >
             <div :class="column.field_name === 'action'
                ? ''
                : 'overflow-auto'" class=" td_overflow_auto max-h-40 max-w-100">
             
                <component
                  v-if="column.tdComp"
                  :is="forDynCompIs(column.tdComp)"
                  :row="item"
                  :field="column.field_name"
                  :xprops="xprops"
                  :tdProps="column.tdProps"
                  @editAction="editAction(item)"
                  @generalAction="generalAction(item)"
                >
                </component>
                <template v-else>
                  <p class="text-pretty" v-html="item[column.field_name]"></p>
                 
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
         v-if="paginatedData.length > 0"
      class="flex items-center justify-between px-4 py-3 bg-white border-gray-200 sm:px-6 dark:text-gray-400 dark:bg-gray-800"
     >
      <div class="flex justify-between flex-1 sm:hidden">
        <a
          href="#"
          
          v-on:click.prevent="previousPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >Previous</a
        >
        <a
          href="#"
          v-on:click.prevent="nextPage"
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >Next</a
        >
      </div>

      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-400">
            Showing
            <span class="font-medium">{{ firstItemIndex }}</span>
            to
            <span class="font-medium">{{ lastItemIndex }}</span>
            of
            <span class="font-medium">{{ filteredData.length }}</span>
            entries
          </p>
        </div>
        <div>
          <nav aria-label="Page navigation">
            <ul class="flex items-center h-8 -space-x-px text-sm">
              <li>
                <a
                  href="#"
                  v-on:click.prevent="previousPage"
                  :disabled="currentPage === 1"
                  class="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 ms-0 border-e-0 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span class="sr-only">Previous</span>
                  <svg
                    class="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </a>
              </li>

              <template
                v-for="pageNumber in displayedPageNumbers"
                :key="pageNumber"
              >
                <li>
                  <a
                    href="#"
                    v-on:click.prevent="goToPage(pageNumber)"
                    v-if="currentPage !== pageNumber"
                    class="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >{{ pageNumber }}</a
                  >
                </li>

                <li>
                  <a
                    href="#"
                    v-on:click.prevent="goToPage(pageNumber)"
                    v-if="currentPage === pageNumber"
                    aria-current="page"
                    class="z-10 flex items-center justify-center h-8 px-3 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    >{{ pageNumber }}</a
                  >
                </li>
              </template>

              <li>
                <a
                  href="#"
                  v-on:click.prevent="nextPage"
                  :disabled="currentPage === totalPages"
                  class="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span class="sr-only">Next</span>
                  <svg
                    class="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import print from "vue3-print-nb";
import * as XLSX from 'xlsx';
export default {
  components: {},
  props: {
    data: Array,
    columns: Array,
    get_item_url: String,
    xprops: Object,
    language: {
      type: Object,
      required: false,
      default: () => { },
    },
    
  },
  data() {
     const randomString = this.generateRandomString(6);
    return {

      isLoadinPrint: false,
      Random_string: randomString,
      printObj: {
        id: "print_" + randomString,
        popTitle: "",
        // preview:true,

        beforeOpenCallback(vue) {


        },
        openCallback(vue) {

          vue.isLoadinPrint = false;


        },
        closeCallback(vue) {

         
         

          vue.isLoadinPrint = false;

        }
      },

      isLoading: false,
     
     // data:[],
      showNoOfEntries: [5, 10, 20, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,11000,12000,13000,14000,15000,16000,17000,18000,19000,20000],
      search: "",
      

      sortKey: "",
      sortOrder: 1,
      currentPage: 1,
      itemsPerPage: 10,
      jumpToPage: "",
      maxDisplayedPages: 10, // Set the maximum number of displayed pagination buttons
    };
  },
  emits: ['editAction','generalAction','deleteAction'],

  computed: {


     itemLists() {
      return this.data;
    },



   filteredData() {
      const searchTerm = this.search.toLowerCase();
      const sortedData = this.sortData(this.itemLists);
      
      if (!searchTerm) {
        return sortedData;
      }
      
      return sortedData.filter((item) => {
        return this.columns.some((column) => {
          const value = item[column.field_name];
          return (
            value !== null &&
            value !== undefined &&
            String(value).toLowerCase().includes(searchTerm)
          );
        });
      });
    },
    totalPages() {
     
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredData.slice(startIndex, endIndex);
    },
    displayedPageNumbers() {
      let startPage = Math.max(
        this.currentPage - Math.floor(this.maxDisplayedPages / 2),
        1
      );
      let endPage = startPage + this.maxDisplayedPages - 1;

      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(endPage - this.maxDisplayedPages + 1, 1);
      }

      return Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
      );
    },
    firstItemIndex() {
      return this.itemsPerPage * (this.currentPage - 1) + 1;
    },
    lastItemIndex() {
      const endIndex = this.itemsPerPage * this.currentPage;
      return endIndex > this.filteredData.length
        ? this.filteredData.length
        : endIndex;
    },
  },
  methods: {



     exportToExcel() {
      // Get the table element
      const table = document.querySelector('#table' + this.Random_string);

      // Get the headers from <thead>
      const headers = Array.from(table.querySelectorAll('thead th'))
        .map((th) => th.innerText);

      // Define a list of headers to exclude (e.g., "Name", "City", etc.)
      const headersToExclude = ['action']; // Add the headers you want to exclude

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


     delayedPrint() {

     


      this.isLoadinPrint = true;

      this.$nextTick(() => {
        this.$refs.hiddenPrintBtn?.click();
        this.isLoadinPrint = false;
      });



    },


    editAction(data) {
    
    this.$emit("editAction",data);
  },

  deleteAction() {
    
    this.$emit("deleteAction");
  },

  

  generalAction(data) {
  
  this.$emit("generalAction",data);
},
  forDynCompIs(component) {
    return typeof component === "object" ? component : null;
  },



    handleItemsPerPageChange(entrie) {
      this.itemsPerPage = entrie;
    },

    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
      }
    },
    sort(column) {


     



      if (column === this.sortKey) {
        this.sortOrder *= -1;
      } else {
        this.sortKey = column;
        this.sortOrder = 1;
      }
    },
    sortData(data) {
      if (this.sortKey) {
        return data.slice().sort((a, b) => {
          return (a[this.sortKey] < b[this.sortKey] ? -1 : 1) * this.sortOrder;
        });
      }
      return data;
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    firstPage() {
      this.currentPage = 1;
    },
    lastPage() {
      this.currentPage = this.totalPages;
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
      }
    },


    GetItemLists() {
      this.isLoading = true;
      

      

      axios
        .get(this.xprops.route_get_data)
        .then((response) => {
          this.itemLists = response.data;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
          this.isLoading = false;
        });
    },





  },
  mounted() {
   // this.GetItemLists();

   
   
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
