<template>
    <div v-if="row[field]">
      <div  class="w-full" v-html="row[field]">

      </div>
    </div>
</template>

  <script>
  export default {
    props: ['field', 'row','tdProps']
  }
  </script>

  <style scoped>

  </style>
