<template>



     <ul ref="tabList" role="tablist" class="flex flex-row flex-wrap gap-2 pt-3 pb-4 mb-0 list-none text-gray-500 dark:text-gray-400" :class="tabsWrapperClass">
          <li
            v-for="(tab, index) in tabs"
            :key="tab.title"
            role="presentation"
            @click="selectedTitle = tab.title"
            class="-mb-px text-center"
            :class="{
              'flex-auto ': autoFlexTabs,

            }"
          >


            <a
               :id="tabId(index)"
               role="tab"
               :aria-selected="selectedTitle === tab.title ? 'true' : 'false'"
               :aria-controls="panelId"
               :tabindex="isTabFocusable(tab, index) ? 0 : -1"
               @keydown="onTabKeydown($event, index)"
               :class="{' bg-gray-50 dark:bg-gray-900  hover:text-gray-900 hover:bg-gray-100  dark:hover:bg-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primaryDark': selectedTitle != tab.title, 'text-white  bg-primary dark:bg-primaryDark': selectedTitle === tab.title}"
              class="block px-5 py-3 text-xs font-bold leading-normal rounded-xl    tabs_buttons"
            >
              <span
                v-if="tab.icon && isSvgIcon(tab.icon)"
                class="inline-flex items-center justify-center me-2 align-middle"
                v-html="tab.icon"
              ></span>
              <i v-else-if="tab.icon" :class="tab.icon" class="me-2 text-sm"></i>{{ tab.title }}
            </a>
          </li>
        </ul>



    <div
      v-show="selectedTitle"
      class="relative flex flex-col w-full min-w-0 mb-6 wrap-break-word  rounded-[20px]  border border-gray-200 dark:border-gray-700 "
    >
      <div class="flex-auto px-4 py-5">
        <div
          :id="panelId"
          role="tabpanel"
          :aria-labelledby="selectedIndex >= 0 ? tabId(selectedIndex) : undefined"
          tabindex="0"
          class="tab-content tab-space"
        >
          <slot />
        </div>
      </div>
    </div>

</template>

<script setup>

import { defineProps, defineEmits, useSlots,onMounted,onBeforeUnmount,Comment,ref, provide, watch, computed } from 'vue';
import { nextGlId } from './useGlFocusTrap.js';

const props = defineProps({
  autoFlexTabs: {
    type: Boolean,
    default: true,
  },
  tabsWrapperClass: {
    type: String,
    default: '',
  },
  activeTab: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['TabChange']);
const slots = useSlots();

//const tabs = ref(slots.default().map((tab) => tab.props));

// Filter out Comment vnodes (produced by v-if=false) before reading props
const tabs = ref(
    (slots.default?.() ?? [])
        .filter(vnode => vnode.type !== Comment && vnode.props !== null)
        .map(vnode => vnode.props)
);

const isSvgIcon = (val) =>
  typeof val === 'string' && /<\s*(svg|path|g|circle|rect)\b/i.test(val);



const selectedTitle = ref("");

provide('selectedTitle', selectedTitle);

// ARIA wiring: one tabpanel, labelled by whichever tab is selected.
const uid = nextGlId("gl-tabs");
const panelId = `${uid}-panel`;
const tabId = (index) => `${uid}-tab-${index}`;
const tabList = ref(null);

const selectedIndex = computed(() => tabs.value.findIndex((tab) => tab.title === selectedTitle.value));

// Roving tabindex: only the selected tab (or the first one when none is
// selected yet) is in the page tab order; arrows move between the others.
const isTabFocusable = (tab, index) =>
  selectedIndex.value >= 0 ? tab.title === selectedTitle.value : index === 0;

const focusTab = (index) => {
  const tab = tabs.value[index];
  if (!tab) return;
  selectedTitle.value = tab.title;
  document.getElementById(tabId(index))?.focus();
};

const onTabKeydown = (event, index) => {
  const count = tabs.value.length;
  if (count === 0) return;

  const isRtl = tabList.value ? getComputedStyle(tabList.value).direction === 'rtl' : false;
  const next = isRtl ? 'ArrowLeft' : 'ArrowRight';
  const previous = isRtl ? 'ArrowRight' : 'ArrowLeft';

  let target = null;
  if (event.key === next) {
    target = (index + 1) % count;
  } else if (event.key === previous) {
    target = (index - 1 + count) % count;
  } else if (event.key === 'Home') {
    target = 0;
  } else if (event.key === 'End') {
    target = count - 1;
  } else if (event.key === 'Enter' || event.key === ' ') {
    target = index;
  }

  if (target === null) return;
  event.preventDefault();
  focusTab(target);
};

// Utility to convert titles to slugs
const slugify = (text) => {
  return text.trim().toLowerCase().replace(/\s+/g, '-');
};


// Set while this component is the one writing the hash.
//
// Assigning window.location.hash makes the browser fire hashchange on a later
// task, and this component listens for it — so its own write came back in as if
// somebody had navigated, and TabChange was emitted a second time, late. Work
// that a consumer ties to the event (flushing an input before its panel
// unmounts, re-binding a plugin) then ran against a DOM that had already moved
// on.
let writingHash = false;

const handleTabChange = (newTitle) => {

 const slug = slugify(newTitle);
  const nextHash = encodeURIComponent(slug);

  // Only flag when a hashchange is actually coming: assigning the value it
  // already holds fires nothing, and a flag left standing would swallow the
  // next genuine navigation instead.
  if (window.location.hash.replace('#', '') !== nextHash) {
    writingHash = true;
    window.location.hash = nextHash;
  }

  emit('TabChange', newTitle);
};

// Method to programmatically change tabs
const setActiveTab = (title) => {

    if (typeof title !== 'string') return;
  const tab = tabs.value.find((tab) => tab.title === title);
  if (tab) {
    selectedTitle.value = title;
  }
};

defineExpose({
  setActiveTab,
});


const updateTabFromHash = () => {
  // Our own write, echoing back. The tab is already the one in the hash, so
  // there is nothing to do and re-entering here would emit TabChange twice.
  if (writingHash) {
    writingHash = false;
    return;
  }

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

// Parent-driven updates via :activeTab prop
watch(() => props.activeTab, (newTitle) => {
  if (newTitle && newTitle !== selectedTitle.value) {
    setActiveTab(newTitle);
  }
});


onMounted(() => {
  updateTabFromHash();
  // If hash didn't resolve a tab, fall back to the activeTab prop
  if (!selectedTitle.value && props.activeTab) {
    setActiveTab(props.activeTab);
  }
  window.addEventListener('hashchange', updateTabFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', updateTabFromHash);
});




</script>

<style scoped></style>
