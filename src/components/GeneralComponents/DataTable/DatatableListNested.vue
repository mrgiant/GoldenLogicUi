<template>
  <div class="flex flex-wrap gap-2">
    <span v-if="isArray" v-for="(item, index) in nestedValue" :key="index" class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">{{ item }}</span>
    <span v-else-if="isObject" class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">{{ nestedValue }}</span>
  </div>
</template>

<script>
  import { markRaw } from 'vue';
  
export default {
  props: ['field', 'row', 'tdProps'],
  computed: {
    entry() {
      const keys = this.field.split('.');
      return markRaw(keys);
     
    },
    nestedValue() {
      return this.entry.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, this.row);
    },
    isArray() {
      return Array.isArray(this.nestedValue);
    },
    isObject() {
      return typeof this.nestedValue === 'object' && !Array.isArray(this.nestedValue);
    }
  }
}
</script>

