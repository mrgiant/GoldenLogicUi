<template>

   

     <ul class="flex flex-row flex-wrap gap-2 pt-3 pb-4 mb-0 list-none text-gray-500 dark:text-gray-400" :class="tabsWrapperClass">
          <li
            v-for="tab in tabs"
            :key="tab.title"
            @click="selectedTitle = tab.title"
            class="-mb-px text-center"
            :class="{
              'flex-auto ': autoFlexTabs,
             
            }"
          >
                

            <a
               :class="{' bg-gray-50 dark:bg-gray-900  hover:text-gray-900 hover:bg-gray-100  dark:hover:bg-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-800': selectedTitle != tab.title, 'text-white  bg-primary dark:bg-primaryDark': selectedTitle === tab.title}"
              class="block px-5 py-3 text-xs font-bold leading-normal rounded-lg    tabs_buttons"
            >
              <i v-if="tab.icon" :class="tab.icon" class="me-2 text-sm"></i>{{ tab.title }}
            </a>
          </li>
        </ul>

       

    <div
      v-show="selectedTitle"
      class="relative flex flex-col w-full min-w-0 mb-6 break-words  rounded-[20px]  border border-gray-200 dark:border-gray-800 "
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

const props = defineProps({
  autoFlexTabs: {
    type: Boolean,
    default: true,
  },
  tabsWrapperClass: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['TabChange']);
const slots = useSlots();

const tabs = ref(slots.default().map((tab) => tab.props));
const selectedTitle = ref("");

provide('selectedTitle', selectedTitle);

// Utility to convert titles to slugs
const slugify = (text) => {
  return text.trim().toLowerCase().replace(/\s+/g, '-');
};


const handleTabChange = (newTitle) => {

 const slug = slugify(newTitle);
  window.location.hash = encodeURIComponent(slug);
  emit('TabChange', newTitle);
};


const updateTabFromHash = () => {
  const hash = decodeURIComponent(window.location.hash.replace('#', ''));

  const tab = tabs.value.find((tab) => slugify(tab.title) === hash);
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
