<script setup>
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
    is_required: {
        type: Boolean,
        default: false,
    },

    show: {
        type: Boolean,
        default: false,
    },

    error_message: {
        type: String,
        default: "",
    },
 

    modelValue: {
        type: Object,
        default: () => ({ start: '', end: '' }),
    },

  
    field_name: {
        type: String,
        default: "",
    },

    label_name: {
        type: String,
        default: "",
    },

    description: {
        type: String,
        default: "",
    },

    placeholder: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue", "keydown"]);


const validationMessage = ref('');

const internalValue = ref({
    start: props.modelValue.start,
    end: props.modelValue.end,
});
const startDate = ref('');
const endDate = ref('');






/*
watch(
    () => props.modelValue,
    (newValue, oldValue) => {

        if(newValue)
        {
            emit("update:modelValue", newValue);
            input.value.value = newValue;
        }
       
    },
    { immediate: true, deep: true }
);
*/





    const proxyValueStart = computed({
  get() {
    return props.modelValue.start;
  },
  set(newValue) {
   // validateDates(newValue.start, newValue.end);
    internalValue.value.start = newValue;
   validateDates(internalValue.value.start, internalValue.value.end);
   emit('update:modelValue', { start: internalValue.value.start, end: internalValue.value.end });
   emit('keydown',{ start: internalValue.value.start, end: internalValue.value.end } );
  },
});



const proxyValueEnd = computed({
  get() {
    return props.modelValue.end;
  },
  set(newValue) {
  
   internalValue.value.end = newValue;
   validateDates(internalValue.value.start, internalValue.value.end);
   emit('update:modelValue', { start: internalValue.value.start, end: internalValue.value.end });
   emit('keydown',{ start: internalValue.value.start, end: internalValue.value.end } );
  },
});







const validateDates = (startDate, endDate) => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        validationMessage.value = 'Start date cannot be after end date.';
        internalValue.value.start = '';
        internalValue.value.end = '';
        emit('update:modelValue', { start: internalValue.value.start, end: internalValue.value.end });
        emit('keydown', { start: internalValue.value.start, end: internalValue.value.end });
    } else if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        validationMessage.value = 'End date cannot be before start date.';
        internalValue.value.start = '';
        internalValue.value.end = '';
        emit('update:modelValue', { start: internalValue.value.start, end: internalValue.value.end });
        emit('keydown', { start: internalValue.value.start, end: internalValue.value.end });
    } else {
        validationMessage.value = '';
    }
};




</script>

<template>
    <div :class="field_name" v-if="show">
        <h3 class="font-bold  dark:text-white">{{ label_name }}</h3>

        <p class="mt-1  text-gray-900 dark:text-white">

            {{ modelValue.start }} to {{ modelValue.end }}
        </p>

        <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <div  :class="field_name" v-if="!show">
        <label
            :class="{
                'gl-label-form': error_message == '' && validationMessage == '',
                'gl-label-form-invalid': error_message !== '' || validationMessage !== '',
                required: is_required,
            }"
            :for="field_name"
            >{{ label_name }}</label
        >


        <div class="flex justify-between gap-1 flex-col md:flex-row text-center">



            <input
            :required="is_required"
            :name="field_name+'Start'"
            :id="field_name+'Start'"
            :class="{
                'gl-input-form': error_message == '' && validationMessage == '',
                'gl-input-form-invalid': error_message !== '' || validationMessage !== '',
            }"
            type="date"
             v-model="proxyValueStart"
            :placeholder="placeholder"
            
             />

        <span class="mx-4 text-gray-500 md:mt-2">to</span>

        <input
            :required="is_required"
            :name="field_name+'End'"
            :id="field_name+'End'"
            :class="{
                'gl-input-form': error_message == '' && validationMessage == '',
                'gl-input-form-invalid': error_message !== '' || validationMessage !== '',
            }"
            type="date"
             v-model="proxyValueEnd"
            :placeholder="placeholder"
           
        />
        
        
        
        
        </div>
        
        
        
        




        <div class="text-center">
        <span class="gl-span-form-error">{{ error_message || validationMessage }}</span>
       </div>

        <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
   
    </div>
</template>
