<template>
    <div class="flex flex-wrap gap-2">

        <span v-if="hasLabelColor=='green'" class="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                <span class="w-2 h-2 bg-green-500 rounded-full me-1"></span>
                {{ this.row[this.field] }}
            </span>


            <span v-if="hasLabelColor=='red'" class="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-300">
                <span class="w-2 h-2 bg-red-500 rounded-full me-1"></span>
                {{ this.row[this.field] }}
            </span>


            <span v-if="hasLabelColor=='yellow'" class="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full dark:bg-gray-700 dark:text-yellow-300">
                <span class="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
                {{ this.row[this.field] }}
            </span>


            <span v-if="hasLabelColor=='default'" class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-gray-700 dark:text-blue-400">
                <span class="w-2 h-2 bg-blue-500 rounded-full me-1"></span>
                {{ this.row[this.field] }}
            </span>




    </div>
</template>

  <script>


  export default {
    props: ['field', 'row','tdProps'],
    computed: {



      hasLabelColor(value) {
    const status = this.tdProps.status_general_labels_color.find(status => status.label === this.row[this.field]);
    return status ? status.class : ''; // Returns the class if found, else an empty string
  }


    }


  }
  </script>

  <style scoped>
  </style>
