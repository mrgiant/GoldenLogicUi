<template>
  <div v-if="isArray" class="grid grid-cols-2 gap-4">
    <div v-for="item in row[field]" :key="item.id">
      <img
        class="h-auto max-w-full rounded-lg"
        :src="item.thumbnail"
        :alt="item.file_name"
      />
    </div>
  </div>

  <div v-else-if="isObject">
    <img
      class="h-auto max-w-full rounded-lg"
      :src="row[field].thumbnail"
      :alt="row[field].file_name"
    />
  </div>
</template>

<script>
export default {
  props: ["field", "row", "tdProps"],

  computed: {
    isArray() {
      return Array.isArray(this.row[this.field]);
    },
    isObject() {
      return typeof this.row[this.field] === "object";
    },
  },
};
</script>

<style scoped></style>
