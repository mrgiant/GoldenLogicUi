<template>
    <div class="flex flex-wrap gap-2 text-nowrap">

       


      <span
      v-if="row[field]===0"
     
      class=" inline-flex lg:items-center px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300"
      ><span class="relative flex w-2 h-2 mr-1"
        ><span
          class="absolute inline-flex w-full h-full bg-blue-500 rounded-full animate-ping"
        ></span
        ><span
          class="relative inline-flex w-2 h-2 bg-blue-500 rounded-full"
        ></span
      ></span>
      Provisioning</span>



      <span
      v-if="row[field]===2"
      class=" inline-flex lg:items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full dark:bg-gray-700 dark:text-yellow-300"
    >
      <span class="w-2 h-2 bg-yellow-500 rounded-full me-1"></span>
      Paused
    </span>


    <span
    v-if="row[field]===1"
      class=" inline-flex lg:items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300"
    >
      <span class="w-2 h-2 bg-green-500 rounded-full me-1"></span>
      Active
    </span>




    </div>
</template>

  <script>


  export default {
    props: ['field', 'row','tdProps'],
   
  }
  </script>

  <style scoped>
  </style>
