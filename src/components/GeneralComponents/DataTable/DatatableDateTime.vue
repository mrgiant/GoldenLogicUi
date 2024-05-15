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
      
      // Get time components
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight
      
      // Format the date and time
      const formattedDateTime = `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
      
      return formattedDateTime;
    },

      isActive() {
        return this.row[this.field]===1;
      }
    }
  }
  </script>

  <style scoped>
  </style>
