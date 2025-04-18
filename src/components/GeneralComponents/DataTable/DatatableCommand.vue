<template>
    <div v-if="row[field]" class="text-nowrap w-full">

      <pre
        
        class=" w-full h-full p-3 mx-0 mt-0 overflow-auto font-mono  text-left  break-words rounded-sm cursor-default whitespace-nowrap console_styles">
        {{ row[field] }} 
        </pre>
     
    </div>
</template>

  <script>
  export default {
    props: ['field', 'row','tdProps']
  }
  </script>

  <style scoped>

  </style>
