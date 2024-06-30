<template>
    <div class="flex flex-wrap gap-2 text-nowrap">

        <span v-if="isActive" class=" inline-flex lg:items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                <span class="w-2 h-2 bg-green-500 rounded-full me-1"></span>
                Active
            </span>


            <span v-else-if="!isActive" class="inline-flex lg:items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium  rounded-full dark:bg-red-900 dark:text-red-300">
                <span class="w-2 h-2 bg-red-500 rounded-full me-1"></span>
                Inactive
            </span>

    </div>
</template>

  <script>


  export default {
    props: ['field', 'row','tdProps'],
    computed: {

      isActive() {
        return this.row[this.field]===1;
      }
    }
  }
  </script>

  <style scoped>
  </style>
