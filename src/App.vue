<script setup>

import {
  ref,
  watch,
  defineProps,
  defineEmits,
  onMounted,
  computed,
  nextTick,
} from "vue";

import CodeEditor  from './components/GeneralComponents/GlCodeMirror.vue';
import GlTextInput   from './components/GeneralComponents/GlTextInput.vue';
import GlDropdown   from './components/GeneralComponents/GlDropdown.vue';
import GLButton   from './components/GeneralComponents/GLButton.vue';
import GlMultiSelectDropdown   from './components/GeneralComponents/GlMultiSelectDropdown.vue';

import GlDatePicker   from './components/GeneralComponents/GlDatePicker.vue';


const provide=ref("");
const code=ref("");


const role = ref([]);


const roles = ref([]);



// after monted wait and then role to be set to [{'id':1,'name':'Admin'}] set time out 2 second

//it show the error Uncaught TypeError: Cannot set properties of undefined (setting 'value')


onMounted(() => {


  setTimeout(() => {
    provide.value = 1;
  }, 2000);



  setTimeout(() => {
    role.value = ["1"];
  }, 2000);

  setTimeout(() => {
    roles.value = [{'id':1,'name':'Admin'},{'id':2,'name':'User'},{'id':3,'name':'Super Admin'}];
  }, 2000);



  console.log("roles",code.value);


});


const onChange = (value) => {
  console.log("roles",value);
};







</script>

<template>
  <div>

 
    <div class="mb-4">


    <GlDatePicker
    v-model="selectedDate"
    label_name="Birth Date"
    field_name="birth_date"
    date_format="DD/MM/YYYY"
    :is_required="true"
    placeholder="Select your birth date"
    min_date="1900-01-01"
    :max_date="new Date().toISOString().split('T')[0]"
    locale="en"
/>


      <GLButton tag="button"  :is_loading="true" button_type="red"
                                classes="w-full block mt-6 !rounded-md " :has_border_reduced="false">sign_in

                            </GLButton>
     
    </div>

                

              
            

         

             
    
</div>
</template>

<style scoped>

</style>
