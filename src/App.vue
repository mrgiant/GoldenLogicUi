<script setup>

import GlTabsWrapper  from './components/GeneralComponents/GlTabsWrapper.vue';
import GlTab   from './components/GeneralComponents/GlTab.vue';
import GlCard   from './components/GeneralComponents/GlCard.vue';



</script>

<template>
  <div>
    <GlCard>
      <template #header> Settings </template>

      <template #body>
        <GlTabsWrapper>
          <GlTab title="General" icon="fas fa-space-shuttle"> fgfgf </GlTab>

          <GlTab title="General1" icon="fas fa-space-shuttle"> fgfgf1 </GlTab>
        </GlTabsWrapper>

        <div class="mb-4">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
        </div>
      </template>
    </GlCard>

    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
