<template>
    <div  class="w-full">

       
       {{ formattedDate }}

   </div>
</template>

  <script>


  export default {
    props: ['field', 'row','tdProps'],
    computed: {


      formattedDate() {

        if (!this.row[this.field]) {
          return '';
        }
      // Convert string datetime to Date object
      const date = new Date(this.row[this.field]);
      
      // Get date components
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      const day = date.getDate();
      
     
      
      // Format the date and time
      const formattedDateTime = `${month} ${day}, ${year}`;
      
      return formattedDateTime;
    },

     
    }
  }
  </script>

  <style scoped>
  </style>
