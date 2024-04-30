<template>
    <div class="p-10" >






        <div class="flex flex-wrap items-center justify-between pb-4 space-y-4 flex-column sm:flex-row sm:space-y-0">
        <div class="main_box_close">
            <button  @click="isDropdownOpen=true" class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                <svg class="w-3 h-3 text-gray-500 dark:text-gray-400 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
                    </svg>
                    Show {{ this.itemsPerPage!="" ? this.itemsPerPage+' rows' : '' }}
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            <!-- Dropdown menu -->
            <div v-show="isDropdownOpen"  class="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" style="position: absolute; margin: 0px;">
                <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">


                    <li   v-for="(entrie, index) in showNoOfEntries"
                          :key="index">
                        <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input @change="handleItemsPerPageChange(entrie)" :id="'e'+entrie" type="radio" value="" name="entries"  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                            <label :for="'e'+entrie" class="w-full text-sm font-medium text-gray-900 rounded ms-2 dark:text-gray-300">{{ entrie }}</label>
                        </div>
                    </li>



                </ul>
            </div>
        </div>
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none rtl:inset-r-0 rtl:right-0 ps-3">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            </div>
            <input type="text" v-model="search"  class="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search ...">
        </div>
    </div>




















        <div class="overflow-auto rounded-lg dark:text-gray-400 dark:bg-gray-800">
            <table class="w-full h-full max-w-full overflow-hidden bg-white md:overflow-auto">
                <thead class="hidden text-sm font-normal text-center text-gray-700 uppercase lg:table-header-group dark:border-strokedark bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr >
                        <th v-for="(column, index) in columns" :key="index" @click="sort(column)"
                            class="px-4 py-2 lg:w-2/12">
                            {{ column }}
                            <span v-if="sortKey === column" class="ml-2">{{ sortOrder === 1 ? '▲' : '▼' }}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                        <td v-for="(column, colIndex) in columns" :key="colIndex" :data-label="column"
                            class=" before:content-[attr(data-label)] before:text-slate-700 before:font-bold lg:before:content-none flex justify-between gap-2  lg:table-cell py-4 px-5 lg:py-2.5 lg:px-4   before:border-b dark:border-gray-700 lg:border-t">
                            <p class="" v-html="item[colIndex]"> </p>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>



        <div class="flex items-center justify-between px-4 py-3 bg-white border-gray-200 sm:px-6 dark:text-gray-400 dark:bg-gray-800">
  <div class="flex justify-between flex-1 sm:hidden">
    <a href="#" @click="previousPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Previous</a>
    <a href="#" @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Next</a>
  </div>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{{ firstItemIndex }}</span>
        to
        <span class="font-medium">{{ lastItemIndex }}</span>
        of
        <span class="font-medium">{{filteredData.length}}</span>
        results
      </p>
    </div>
    <div>
        <nav class="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
        <a href="#" @click="previousPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </a>
        <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->

        <template v-for="pageNumber in displayedPageNumbers" :key="pageNumber">

            <a href="#"  @click="goToPage(pageNumber)" v-if="currentPage === pageNumber" aria-current="page" class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{{ pageNumber }}</a>
            <a href="#" @click="goToPage(pageNumber)" v-if="currentPage !== pageNumber" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{ pageNumber }}</a>

        </template>


        <a href="#" @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Next</span>
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </a>
      </nav>
    </div>
  </div>
</div>







    </div>
</template>

<script>

import TextSelect from "./TextSelect.vue";
export default {
    components: {


TextSelect,



},
    props: {
        data: Array,
        columns: Array,
    },
    data() {
        return {
            showNoOfEntries: [10,20,30,40],
            search: '',
            isDropdownOpen: false,
      sortKey: '',
      sortOrder: 1,
      currentPage: 1,
      itemsPerPage: 10,
      jumpToPage: '',
      maxDisplayedPages: 10, // Set the maximum number of displayed pagination buttons
        };
    },
    computed: {
        filteredData() {
            const searchTerm = this.search.toLowerCase();
            const sortedData = this.sortData(this.data);
            return sortedData.filter(item => {
                return Object.values(item).some(value =>
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
      let startPage = Math.max(this.currentPage - Math.floor(this.maxDisplayedPages / 2), 1);
      let endPage = startPage + this.maxDisplayedPages - 1;

      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(endPage - this.maxDisplayedPages + 1, 1);
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    },
    firstItemIndex() {
      return this.itemsPerPage * (this.currentPage - 1) + 1;
    },
    lastItemIndex() {
      const endIndex = this.itemsPerPage * this.currentPage;
      return endIndex > this.filteredData.length ? this.filteredData.length : endIndex;
    },
    },
    methods: {


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
    onJumpToPageChange() {
      const value = parseInt(this.jumpToPage);
      if (value >= 1 && value <= this.totalPages) {
        this.jumpToPage = value;
      }
    },
    jumpToPageButton() {
      if (this.jumpToPage >= 1 && this.jumpToPage <= this.totalPages) {
        this.currentPage = this.jumpToPage;
      }
    },
    closeBoxOnbodyClick() {
      if (!event.target.closest(".main_box_close")) {
        this.isDropdownOpen = false;
      }
    },
    },

    beforeDestroy() {
    // Remove the event listener to prevent memory leaks
    document.body.removeEventListener("click", this.closeBoxOnbodyClick);
  },
  mounted() {


    document.body.addEventListener("click", this.closeBoxOnbodyClick);
  },
};
</script>
