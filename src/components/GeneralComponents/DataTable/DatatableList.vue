<template>
    <div class="flex flex-wrap gap-2" v-if="this.row[this.entry.key]">
      <span v-if="isArray" v-for="(item, index) in row[entry.key]" :key="index" class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">{{ item[entry.field] }}</span>
      <span v-else-if="isObject" class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">{{ row[entry.key][entry.field] }}</span>
    </div>
</template>

  <script>
  import { markRaw } from 'vue';

  export default {
    props: ['field', 'row','tdProps'],
    computed: {
      entry() {
        const [key, field] = this.field.split('.');
        return markRaw({ key, field });
      },
      isArray() {
        return Array.isArray(this.row[this.entry.key]);
      },
      isObject() {
        return typeof this.row[this.entry.key] === 'object';
      }
    }
  }
  </script>

  <style scoped>
  </style>
