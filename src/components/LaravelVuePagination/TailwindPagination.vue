<template>
  <RenderlessPagination
    :data="data"
    :limit="limit"
    @pagination-change-page="onPaginationChangePage"
    v-slot="slotProps"
  >
    <div class="flex flex-col items-center w-full" :class="classes" v-if="slotProps.computed.total > slotProps.computed.perPage">
      <!-- Help text -->
      <span
        class="text-sm text-gray-700 dark:text-gray-400"
        v-if="slotProps.computed.total > slotProps.computed.perPage"
      >
        {{ translation.showing }}
        <span class="font-semibold text-gray-900 dark:text-white">{{
          slotProps.computed.from
        }}</span>
        {{ translation.to }}

        <span class="font-semibold text-gray-900 dark:text-white">{{
          slotProps.computed.to
        }}</span>
        {{ translation.of }}
        <span class="font-semibold text-gray-900 dark:text-white">{{
          slotProps.computed.total
        }}</span>
        {{ translation.entries }}
      </span>

      <ul
        v-bind="$attrs"
        class="flex  flex-wrap items-center h-8 -space-x-px text-sm"
        :class="{
          'pagination-sm': size == 'small',
          'pagination-lg': size == 'large',
          'justify-content-center': align == 'center',
          'justify-content-end': align == 'right',
        }"
        v-if="slotProps.computed.total > slotProps.computed.perPage"
      >
        <li
          class="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 ms-0 border-e-0 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="{ disabled: !slotProps.computed.prevPageUrl }"
          v-if="slotProps.computed.prevPageUrl || showDisabled"
        >
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            :tabindex="!slotProps.computed.prevPageUrl && -1"
            v-on="slotProps.prevButtonEvents"
          >
            <slot name="prev-nav">
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
            </slot>
          </a>
        </li>

        <li
          class=""
          v-for="(page, key) in slotProps.computed.pageRange"
          :key="key"
          :class="{ active: page == slotProps.computed.currentPage }"
        >
          <a
            class=""
            href="#"
            v-on="slotProps.pageButtonEvents(page)"
            :aria-current="
              page == slotProps.computed.currentPage ? 'page' : null
            "
            :class="
              page == slotProps.computed.currentPage
                ? 'z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                : 'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            "
          >
            {{ page }}
          </a>
        </li>

        <li
          class="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="{ disabled: !slotProps.computed.nextPageUrl }"
          v-if="slotProps.computed.nextPageUrl || showDisabled"
        >
          <a
            class=""
            href="#"
            aria-label="Next"
            :tabindex="!slotProps.computed.nextPageUrl && -1"
            v-on="slotProps.nextButtonEvents"
          >
            <slot name="next-nav">
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
            </slot>
          </a>
        </li>
      </ul>
    </div>
  </RenderlessPagination>
</template>

<script>
import RenderlessPagination from "./RenderlessPagination.vue";

export default {
  compatConfig: {
    MODE: 3,
  },

  inheritAttrs: false,

  emits: ["pagination-change-page"],

  components: {
    RenderlessPagination,
  },

  props: {


    translation: {
      type: Object,
      default: () => ({
        of: "of",
        entries: "Entries",
        showing: "Showing",
        to: "to",
      }),
    },


    data: {
      type: Object,
      default: () => {},
    },
    limit: {
      type: Number,
      default: 0,
    },
    showDisabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "default",
      validator: (value) => {
        return ["small", "default", "large"].indexOf(value) !== -1;
      },
    },
    align: {
      type: String,
      default: "left",
      validator: (value) => {
        return ["left", "center", "right"].indexOf(value) !== -1;
      },
    },

    classes:{
      type: String,
      default: "",
    }
  },

  methods: {
    onPaginationChangePage(page) {
      this.$emit("pagination-change-page", page);
    },
  },

  mounted() {
     //console.log(this.slotProps);
  },
};
</script>
