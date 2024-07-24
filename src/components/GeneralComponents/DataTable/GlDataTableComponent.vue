<template>
  <div class="p-2">
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
          class="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search ..."
        />
      </div>
    </div>

    <div class="overflow-auto rounded-lg dark:text-gray-400 dark:bg-gray-800">
      <table
        class="w-full h-full max-w-full overflow-hidden bg-white border-separate xl:overflow-auto lg:border-collapse border-spacing-y-5 lg:border-spacing-y-0 dark:border-strokedark dark:bg-boxdark"
      >
        <thead
          class="hidden text-sm font-normal text-center text-gray-500 lg:table-header-group dark:border-strokedark bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              @click="sort(column.field_name, column.sortable)"
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
                class=" p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
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
            v-for="(item, index) in filteredData"
            :key="index"
            class="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:dark:text-gray-200 text-gray-500"
          >

          <!-- remove  md:flex-row from  below td to be the text below lable if want in line add it -->
            <td
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              :data-label="column.field_label"
              class="text-pretty before:content-[attr(data-label)] before:font-bold lg:before:content-none flex flex-col justify-between gap-2 lg:table-cell py-4 px-5 lg:py-3 lg:px-4 border-[0.3px] dark:border-gray-700"

              :class="{
          
          'rounded-t-lg lg:rounded-t-none': colIndex === 0,
          'rounded-b-lg lg:rounded-b-none': colIndex === columns.length - 1
        }"
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
export default {
  components: {},
  props: {
    data: Array,
    columns: Array,
    get_item_url: String,
    xprops: Object,
    
  },
  data() {
    return {
      isLoading: false,
      itemLists:[],
      data:[],
      showNoOfEntries: [1, 2, 3, 10, 20, 30, 40],
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
    filteredData() {
      const searchTerm = this.search.toLowerCase();
      const sortedData = this.sortData(this.itemLists);
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
      this.page = page;

      

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
    this.GetItemLists();
   
  },
};
</script>
