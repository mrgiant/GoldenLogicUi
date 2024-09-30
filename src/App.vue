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

import GlTabsWrapper  from './components/GeneralComponents/GlTabsWrapper.vue';
import GlTextInput   from './components/GeneralComponents/GlTextInput.vue';
import GlDropdown   from './components/GeneralComponents/GlDropdown.vue';
import GlMultiSelectDropdown   from './components/GeneralComponents/GlMultiSelectDropdown.vue';



const provide=ref("");


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


});







</script>

<template>
  <div>

 
    <div class="mb-4">
                    <GlDropdown
                        :options="roles"
                        :is_required="true"
                        field_name="provider"
                        label_name="Provider"
                        :show="false"
                        placeholder="Please select an option"
                        
                        v-model="provide"
                    >
                    </GlDropdown>
                </div>

                

              
            

         

                <div class="mb-4">



                <GlMultiSelectDropdown
                        :options="roles"
                        :is_required="false"
                        field_name="roles"
                        label_name="Roles"
                        :show="false"
                        v-model="role"
                        placeholder="Please select an option"
                    >
                    </GlMultiSelectDropdown>


                    </div>

                 

    
</div>
</template>

<style scoped>

</style>
