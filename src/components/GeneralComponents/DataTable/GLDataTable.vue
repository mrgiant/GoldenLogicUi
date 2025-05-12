<template>
  <div class="p-2">
    <button ref="hiddenPrintBtn" v-print="printObj" style="display: none"></button>

    <div
      class="flex flex-wrap pb-4 space-y-4 md:items-center md:justify-between flex-column sm:flex-row sm:space-y-0"
    >
      <div class="flex items-center gap-2">
        <span class="font-medium"> Show </span>

        <div style="margin-top: 9px">
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
          class="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg  w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        class="w-full h-full max-w-full overflow-hidden bg-white border-separate xl:overflow-auto lg:border-collapse print:border-collapse! border-spacing-y-5 lg:border-spacing-y-0 print:border-spacing-y-0! dark:border-strokeDark dark:bg-boxDark"
      >
        <thead
          class="hidden text-sm font-normal text-center text-gray-500 print:table-header-group! lg:table-header-group dark:border-strokeDark bg-gray-50 dark:bg-gray-700 dark:text-gray-400 print:border-[1px]!"
        >
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              v-on:click.prevent="sort(column)"
              class="w-full px-4 py-2 lg:w-2/12 print:w-2/12! print:border-[1px]!"
            >
              {{ column }}

            

              <span v-if="sortKey === column" class="ml-2">
                <i v-if="sortOrder === 1" class="fa fa-arrow-up"></i>
                <i v-else class="fa fa-arrow-down"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedData"
            :key="index"
            class="text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            <td
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              :data-label="column"
              class="text-pretty before:content-[attr(data-label)] before:font-bold lg:before:content-none print:before:content-none! flex flex-col justify-between gap-2 lg:table-cell print:table-cell! py-4 px-5 lg:py-3 lg:px-4 print:py-3! print:px-4! border-[1px]! dark:border-gray-700"
              :class="{
                /* 'rounded-t-lg lg:rounded-t-none': colIndex === 0,*/
                'rounded-b-lg lg:rounded-b-none!':
                  colIndex === columns.length - 1,

              }"
              >
              <p class="text-pretty" v-html="item[colIndex]"></p>
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
  computed: {
    filteredData() {
      const searchTerm = this.search.toLowerCase();
      const sortedData = this.sortData(this.data);
      return sortedData.filter((item) => {
        return Object.values(item).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchTerm)
        );
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

