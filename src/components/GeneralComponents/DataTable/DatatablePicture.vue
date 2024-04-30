<template>
    <div v-if="row[field]">
      <div  class="m-1 d-inline-block">
        <a :href="row[field].url" :title="row[field].name" target="_blank">
          <img :src="row[field].thumbnail" :alt="row[field].name" :title="row[field].name" />
        </a>
      </div>
    </div>
</template>

  <script>
  export default {
    props: ['field', 'row','tdProps']
  }
  </script>

  <style scoped>
  a {
    font-size: 13px;
    font-weight: 500;
    color: #202124;
  }
  a:hover {
    color: #9c27b0;
    text-decoration: underline;
  }
  </style>
