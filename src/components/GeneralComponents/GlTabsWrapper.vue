<template>



     <ul ref="tabList" role="tablist" class="flex flex-row flex-wrap mb-0 list-none text-gray-500 dark:text-gray-400" :class="[isUnderline ? 'gap-1 px-2 mb-4 bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700' : 'gap-2 pt-3 pb-4', tabsWrapperClass]">
          <li
            v-for="(tab, index) in tabs"
            :key="tab.title"
            role="presentation"
            @click="selectedTitle = tab.title"
            class="-mb-px text-center"
            :class="{
              'flex-auto ': autoFlexTabs && !isUnderline,

            }"
          >


            <a
               :id="tabId(index)"
               role="tab"
               :aria-selected="selectedTitle === tab.title ? 'true' : 'false'"
               :aria-controls="panelId"
               :tabindex="isTabFocusable(tab, index) ? 0 : -1"
               @keydown="onTabKeydown($event, index)"
               :class="tabClasses(tab)"
              class="block leading-normal tabs_buttons"
            >
              <span
                v-if="tab.icon && isSvgIcon(tab.icon)"
                class="inline-flex items-center justify-center me-2 align-middle"
                v-html="tab.icon"
              ></span>
              <i v-else-if="tab.icon" :class="tab.icon" class="me-2 text-sm"></i>{{ tab.title }}
              <span
                v-if="tab.badge !== undefined && tab.badge !== null && tab.badge !== ''"
                class="inline-flex items-center px-2 py-0.5 ms-2 text-[11px] font-semibold rounded-full align-middle"
                :class="selectedTitle === tab.title && !isUnderline ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'"
              >{{ tab.badge }}</span>
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
  // 'pills' (the default) draws each tab as a button; 'underline' draws a
  // single bar with a line under the selected tab, for pages with many tabs.
  variant: {
    type: String,
    default: 'pills',
  },
  // Keep a tab's content mounted once it has been opened, so coming back to
  // it does not reload it or lose its page, search and scroll.
  keepAlive: {
    type: Boolean,
    default: false,
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
provide('glTabsKeepAlive', computed(() => props.keepAlive));

const isUnderline = computed(() => props.variant === 'underline');

const tabClasses = (tab) => {
  const selected = selectedTitle.value === tab.title;

  if (isUnderline.value) {
    return [
      'px-3 pt-3.5 pb-3 text-sm border-b-[3px] cursor-pointer',
      selected
        ? 'font-bold text-gray-900 border-primary dark:text-white dark:border-primaryDark'
        : 'font-medium border-transparent hover:text-gray-900 hover:border-gray-300 dark:hover:text-white dark:hover:border-gray-600',
    ];
  }

  return [
    'px-5 py-3 text-xs font-bold rounded-xl',
    selected
      ? 'text-white  bg-primary dark:bg-primaryDark'
      : ' bg-gray-50 dark:bg-gray-900  hover:text-gray-900 hover:bg-gray-100  dark:hover:bg-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primaryDark',
  ];
};

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
