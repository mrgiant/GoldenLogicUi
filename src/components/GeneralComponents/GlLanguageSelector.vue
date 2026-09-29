<template>

<ul class="grid w-full gap-1 mt-5 mb-5 md:gap-0 md:grid-cols-10 language-selector" :class="selectorClass" ref="language_selector" >

    <li v-for="(lang, index) in glLocale.locals" :key="lang">
        <!-- Bound to the shared store: every translate field on the page reads
             glLocale.current, so checking a radio re-renders them all in the
             chosen language. No DOM plugin, no change-event wiring. -->
        <input
            type="radio"
            :name="trans_selector_name"
            :value="lang"
            class="hidden! peer"
            :id="lang + '_' + field_name"
            autocomplete="off"
            v-model="glLocale.current"
        >
        <label :for="lang+'_'+field_name"

        :class="{
      'border md:rounded-s-lg!': index===0,
      'border md:rounded-e-lg!': index === glLocale.locals.length - 1,
      'border-t border-b': index !== 0 && index !== glLocale.locals.length - 1
        }"

         class="block w-full p-1 font-bold text-center text-gray-500 uppercase bg-white border-gray-200 rounded-lg cursor-pointer md:rounded-none dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">

            {{ lang }}

        </label>
    </li>

</ul>

</template>
<script>
import { glLocale, setGlLocales } from "../../localeStore";

export default {

    props: {

        field_name: {
            type: String,
            default: "",
        },

        trans_selector_name: {
            type: String,
            default: "i18n_selector",
        },

        // Kept on the element from first render (it used to be added only after
        // the locales request returned): consuming apps count elements carrying
        // it to decide when a modal has finished loading.
        selectorClass: {
            type: String,
            default: "gl-multilanguage",
        },

    },

    data() {
        return {
            glLocale,
        };
    },

    methods: {

        getLocals() {
            // Already fetched by another selector on the page; the store is
            // shared, so there is nothing to ask the server again for.
            if (glLocale.locals.length > 0) {
                return;
            }

            axios
                .get("/admin/get_locals")
                .then((response) => {
                    setGlLocales(response.data.locals, response.data.default_language);
                })
                .catch((error) => {
                    console.error(error);
                });
        },

    },

    created() {

        this.getLocals();

    },
};
</script>

<style scoped>

</style>
