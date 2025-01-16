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
               :class="{'text-slate-600 bg-white dark:bg-meta': selectedTitle != tab.title, 'text-white  bg-black dark:bg-primary': selectedTitle === tab.title}"
              class="block px-5 py-3 text-xs font-bold leading-normal  rounded shadow-lg hover:text-white tex hover:bg-black dark:hover:bg-primary dark:text-white tabs_buttons"
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

<script setup>
import { ref, provide, watch } from 'vue';
import { defineProps, defineEmits, useSlots,onMounted,onBeforeUnmount } from 'vue';

const props = defineProps({});
const emit = defineEmits(['TabChange']);
const slots = useSlots();

const tabs = ref(slots.default().map((tab) => tab.props));
const selectedTitle = ref("");

provide('selectedTitle', selectedTitle);


const handleTabChange = (newTitle) => {
  window.location.hash = encodeURIComponent(newTitle);
  emit('TabChange', newTitle);
};


const updateTabFromHash = () => {
  const hash = decodeURIComponent(window.location.hash.replace('#', ''));
  const tab = tabs.value.find((tab) => tab.title === hash);
  if (tab) {
    selectedTitle.value = tab.title;
  }
  else {
   // selectedTitle.value = tabs.value[0].title;
    //emit('TabChange', tabs.value[0].title);
  }
};





watch(selectedTitle, (newTitle) => {
  handleTabChange(newTitle);
});


onMounted(() => {
  updateTabFromHash();
  window.addEventListener('hashchange', updateTabFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', updateTabFromHash);
});







</script>

<style scoped></style>
