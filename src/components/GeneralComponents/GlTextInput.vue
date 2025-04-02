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
        type: [String, Number],
        default: "",
    },

    type: {
        type: String,
        default: "text",
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
    minlength: {
        type: String,
        default: null,
    },
    maxlength: {
        type: String,
        default: null,
    },

    input_class: {
        type: String,
        default: "",
    },
    container_class: {
        type: String,
        default: "",
    },

});

const emit = defineEmits(["update:modelValue", "keydown", "blur"]);

const input = ref(null);


onMounted(() => {
    if (input.value !== null && input.value.hasAttribute("autofocus")) {
        input.value.focus();
    }

   
});






   const proxyValue = computed({

    get()
    {
        return props.modelValue;
    },
    set(newValue)
    {
        emit("update:modelValue", newValue);
       

    }
   
   
    });




defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <div :class="field_name" v-if="show">
        <h3 class="font-bold dark:text-white">{{ label_name }}</h3>

        <p class="mt-1 text-gray-900 dark:text-white">
            {{
                type == "password"
                    ? modelValue.replace(/./g, "*")
                    : modelValue
            }}
        </p>

        <hr class="!opacity-100 bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <div  
    
    

     :class="{
        [field_name]: field_name && field_name !== '',
        [container_class]: container_class && container_class !== ''
    }"
    
    
     v-if="!show">
        <label
            v-if="label_name"
            :class="{
                'gl-label-form': error_message == '',
                'gl-label-form-invalid': error_message !== '',
                required: is_required,
            }"
            :for="field_name"
            >{{ label_name }}</label
        ><input

            :minlength="minlength"
            :maxlength="maxlength"
            class="rtl:text-right"
            :required="is_required"
            :name="field_name"
            :id="field_name"
            :class="{
                'gl-input-form': error_message == '',
                'gl-input-form-invalid': error_message !== '',
                [input_class]: input_class && input_class !== ''
            }"
            :type="type"
             v-model="proxyValue"
            @keydown="$emit('keydown', $event)"
            @blur="$emit('blur', $event)"
            ref="input"
            :placeholder="placeholder"
        />

        <span class="gl-span-form-error">{{ error_message }}</span>

        <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
    </div>
</template>
