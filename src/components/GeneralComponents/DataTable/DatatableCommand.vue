<template>
    <div v-if="row[field]" class="text-nowrap">

      <pre
        class=" w-full h-full p-3 mx-0 mt-0 overflow-auto font-mono  text-left text-white break-words rounded cursor-default whitespace-nowrap bg-zinc-700">
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
