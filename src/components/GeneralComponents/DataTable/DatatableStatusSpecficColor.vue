<template>
    <div class="flex flex-wrap gap-2 text-nowrap lg:justify-center	">



<span v-if="hasLabelColor=='Default'" class="bg-blue-100 text-blue-800  font-medium me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 border-blue-400" :class="badgeType"> {{ this.row[this.field] }}</span>
<span v-if="hasLabelColor=='Dark'" class="bg-gray-100 text-gray-800  font-medium me-2 px-2.5 py-0.5  dark:bg-gray-700 dark:text-gray-300 border-gray-500" :class="badgeType"> {{ this.row[this.field] }}</span>
<span v-if="hasLabelColor=='Red'" class="bg-red-100 text-red-800  font-medium me-2 px-2.5 py-0.5  dark:bg-red-900 dark:text-red-300 border-red-400" :class="badgeType"> {{ this.row[this.field] }}</span>
<span v-if="hasLabelColor=='Green'" class="bg-green-100 text-green-800  font-medium me-2 px-2.5 py-0.5  dark:bg-green-900 dark:text-green-300 border-green-400" :class="badgeType"> {{ this.row[this.field] }}</span>
<span v-if="hasLabelColor=='Yellow'" class="bg-yellow-100 text-yellow-800  font-medium me-2 px-2.5 py-0.5  dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300" :class="badgeType"> {{ this.row[this.field] }}</span>
<span v-if="hasLabelColor=='Indigo'" class="bg-indigo-100 text-indigo-800  font-medium me-2 px-2.5 py-0.5  dark:bg-indigo-900 dark:text-indigo-300 border-indigo-400" :class="badgeType"> {{ this.row[this.field] }}</span>
<span v-if="hasLabelColor=='Purple'" class="bg-purple-100 text-purple-800  font-medium me-2 px-2.5 py-0.5  dark:bg-purple-900 dark:text-purple-300 border-purple-400" :class="badgeType"> {{ this.row[this.field] }}</span>
<span v-if="hasLabelColor=='Pink'" class="bg-pink-100 text-pink-800  font-medium me-2 px-2.5 py-0.5  dark:bg-pink-900 dark:text-pink-300 border-pink-400" :class="badgeType"> {{ this.row[this.field] }}</span>






    </div>
</template>

  <script>





  export default {
    props: ['field', 'row','tdProps'],
    computed: {



      hasLabelColor() {
          const status = this.tdProps.specfic_color;
          return status ?? '';
        },



        badgeType() {


switch (this.tdProps.badge_type) {
    case "Default":
        return "rounded text-xs";
    case "Large":
        return "rounded text-sm ";
    case "Bordered":
        return "rounded text-xs border";
    case "Pills":
        return "rounded-full text-xs";
  
    default:
        return "";
}
},


    }


  }
  </script>

  <style scoped>
  </style>
