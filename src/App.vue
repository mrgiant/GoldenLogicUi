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
import GlMultiSelectDropdown   from './components/GeneralComponents/GlMultiSelectDropdown.vue';



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
      <CodeEditor v-model="code" language="javascript" theme=""
      
                       :is_required="false"
                        field_name="roles"
                        label_name="Roles"
                        :show="false"
                        error_message="njnjnn"
                        placeholder="Please select an option"
                        @change="onChange"
      
      
      
       />
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
