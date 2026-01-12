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
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      // Get time components
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight
      const formattedHours = String(hours).padStart(2, '0');
      
      // Format the date and time
      const formattedDateTime = `${day}-${month}-${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
      
      return formattedDateTime;
    },

     
    }
  }
  </script>

  <style scoped>
  </style>
