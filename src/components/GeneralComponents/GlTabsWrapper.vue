<template>

    <div class="flex flex-wrap">
      <div class="w-full">
        <ul class="flex flex-row flex-wrap gap-1 pt-3 pb-4 mb-0 list-none">
          <li
            v-for="tab in tabs"
            :key="tab.title"
            @click="selectedTitle = tab.title"
            class="flex-auto -mb-px text-center"
          >
            <a
               :class="{'text-slate-600 bg-white dark:bg-meta-4': selectedTitle != tab.title, 'text-white  bg-slate-600 dark:bg-primary': selectedTitle === tab.title}"
              class="block px-5 py-3 text-xs font-bold leading-normal  rounded shadow-lg hover:text-white tex hover:bg-slate-600 dark:hover:bg-primary dark:text-white tabs_buttons"
            >
              <i :class="tab.icon" class="mr-1 text-base"></i> {{ tab.title }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="relative flex flex-col w-full min-w-0 mb-6 break-words bg-white rounded shadow-lg dark:border-strokedark dark:bg-boxdark"
    >
      <div class="flex-auto px-4 py-5">
        <div class="tab-content tab-space">
          <slot />
        </div>
      </div>
    </div>

</template>

<script>
import { ref, provide } from "vue";
export default {
  setup(props, { slots }) {
    // to only get title from slots tabs
   // const tabTitles = ref(slots.default().map((tab) => tab.props.title))
    const tabs = ref(slots.default().map((tab) => tab.props))


    const selectedTitle = ref(tabs.value[0].title)
    provide("selectedTitle", selectedTitle)

    return {
        tabs,
      selectedTitle,
    };
  },
}
</script>

<style scoped></style>
