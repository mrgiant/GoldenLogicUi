<template>
  <div class="flex flex-wrap gap-2 text-nowrap">
    <span
      v-if="hasLabelColor == 'green'"
      class=" inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300"
    >
      <span class="w-2 h-2 bg-green-500 rounded-full me-1"></span>
      {{ getLabel }}
    </span>

    <span
      v-if="hasLabelColor == 'red'"
      class=" inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-300"
    >
      <span class="w-2 h-2 bg-red-500 rounded-full me-1"></span>
      {{ getLabel }}
    </span>

    <span
      v-if="hasLabelColor == 'yellow'"
      class=" inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full dark:bg-gray-700 dark:text-yellow-300"
    >
      <span class="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
      {{ getLabel }}
    </span>

    <span
      v-if="hasLabelColor == 'default'"
      class=" inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-gray-700 dark:text-blue-400"
    >
      <span class="w-2 h-2 bg-blue-500 rounded-full me-1"></span>
      {{ getLabel }}
    </span>

    <span
      v-if="hasLabelColor == 'animate'"
      class=" inline-flex items-center px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300"
      ><span class="relative flex w-2 h-2 mr-1"
        ><span
          class="absolute inline-flex w-full h-full bg-blue-500 rounded-full animate-ping"
        ></span
        ><span
          class="relative inline-flex w-2 h-2 bg-blue-500 rounded-full"
        ></span
      ></span>
      {{ getLabel }}</span
    >
  </div>
</template>

<script>
export default {
  props: ["field", "row", "tdProps"],
  computed: {
    hasLabelColor(value) {
      const status = this.tdProps.status_general_labels_color.find(
        (status) => status.text === this.row[this.field]
      );
      return status ? status.class : ""; // Returns the class if found, else an empty string
    },

    getLabel() {
      const status = this.tdProps.status_general_labels_color.find(
        (status) => status.text === this.row[this.field]
      );
      return status ? status.label : ""; // Returns the class if found, else an empty string
    },
  },
};
</script>

<style scoped></style>
