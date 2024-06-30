<template>
<div class="flex flex-wrap gap-2">
    <span v-if="isArray" v-for="(item, index) in getNestedValue(row, entry.keys)" :key="index" class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">{{ item[entry.field] }}</span>
    <span v-else-if="isObject" class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">{{ getNestedValue(row, entry.keys)[entry.field] }}</span>
  </div>
</template>

<script>
export default {
  props: ['field', 'row', 'tdProps'],
  computed: {
    entry() {
      const keys = this.field.split('.');
      const field = keys.pop();
      return { keys, field };
    },
    isArray() {
      return Array.isArray(this.getNestedValue(this.row, this.entry.keys));
    },
    isObject() {
      return typeof this.getNestedValue(this.row, this.entry.keys) === 'object';
    }
  },
  methods: {
    getNestedValue(obj, keys) {
      return keys.reduce((o, k) => (o || {})[k], obj);
    }
  }
}
</script>

