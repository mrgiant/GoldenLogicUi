<template>


<ul class="grid w-full gap-1 mt-5 mb-5 md:gap-0 md:grid-cols-10 language-selector">


    <li v-for="(lang, index) in locals" >
        <input type="radio" :name="trans_selector_name" :value="lang" class="hidden peer" :id="lang + '_' + field_name" autocomplete="off" :checked="lang === default_language">
        <label :for="lang+'_'+field_name"



        :class="{
      'border md:!rounded-s-lg': index===0,
      'border md:!rounded-e-lg': index === locals.length - 1,
      'border-t border-b': index !== 0 && index !== locals.length - 1
        }"

         class="w-full p-1 font-bold text-center text-gray-500 uppercase bg-white border-gray-200 rounded-lg cursor-pointer md:rounded-none dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">

            {{ lang }}

        </label>
    </li>



</ul>

</template>
<script>

export default {
    components: {

    },

    props: {

        field_name: {
            type: String,
            default: "",
        },

        trans_selector_name: {
            type: String,
            default: "i18n_selector",
        },


    },







    data() {
        return {

            locals:[],
            default_language:"",



        };
    },
    methods: {


        getLocals() {

            const params = {
                id: this.menu_id,
            };


            axios
                .get("/admin/get_locals", { params })
                .then((response) => {
                    this.locals = response.data.locals;
                    this.default_language = response.data.default_language;

                    console.log('default_language', this.default_language);


                    // this.is_loading = false;
                    // this.is_search = false;
                })
                .catch((error) => {
                    console.error(error);
                    //this.is_loading = false;
                    //this.is_search = false;
                });
        },


    },

    created() {

        this.getLocals();

    },
    mounted() {








    },
};
</script>

<style scoped>

</style>
