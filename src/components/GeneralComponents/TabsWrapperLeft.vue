<template>





<div class="md:flex">
    <ul class="mb-4 space-y-4 text-sm font-medium text-gray-500 flex-column space-y dark:text-gray-400 md:me-4 md:mb-0">
        <li  v-for="tab in tabs"
            :key="tab.title"
            @click="selectedTitle = tab.title">

            <a href="#"

            :class="{'dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white hover:text-gray-900 bg-gray-50 hover:bg-gray-100': selectedTitle != tab.title, 'text-white bg-blue-700 dark:bg-blue-600': selectedTitle === tab.title}"


            class="inline-flex items-center w-full px-4 py-3 rounded-lg " aria-current="page">
            <i :class="[tab.icon,
            {'w-4 h-4 text-gray-500 me-2 dark:text-gray-400': selectedTitle != tab.title,
             'w-4 h-4 text-white me-2': selectedTitle === tab.title}]"
             ></i>{{ tab.title }}
            </a>
        </li>

    </ul>
    <div class="w-full p-6 text-gray-500 rounded-lg bg-gray-50 text-medium dark:text-gray-400 dark:bg-gray-800">
        <slot />
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
