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



const provide=ref[""];

</script>

<template>
  <div>


    <div class="mb-4">
                    <GlDropdown
                        :options="['slack', 'email', 'discord', 'whatsapp']"
                        :is_required="true"
                        field_name="provider"
                        label_name="Provider"
                        :show="false"
                        placeholder="Please select an option"
                        
                        v-model="provide"
                    >
                    </GlDropdown>
                </div>

    
</div>
</template>

<style scoped>

</style>
