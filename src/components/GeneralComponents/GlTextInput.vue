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

    inputGroupType: {
        type: String,
        default: "",
    },

    inputGroupText: {
        type: String,
        default: "",
    },

});

const emit = defineEmits(["update:modelValue", "keydown", "blur-sm","keyup"]);

const input = ref(null);


onMounted(() => {
    if (input.value !== null && input.value.hasAttribute("autofocus")) {
        input.value.focus();
    }


});






const proxyValue = computed({

    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);


    }


});




defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <div :class="field_name" v-if="show">
       
        <label v-if="label_name" class="gl-label-form">{{ label_name }}</label>

        <p class="mt-1 text-gray-900 dark:text-white">
            {{
                type == "password"
                    ? modelValue.replace(/./g, "*")
                    : modelValue
            }}
        </p>

        <hr class="opacity-100! bg-gray-200 border-0 dark:bg-gray-700" />
    </div>

    <div :class="{
        [field_name]: field_name && field_name !== '',
        [container_class]: container_class && container_class !== ''
    }" v-if="!show">
        <label v-if="label_name" :class="{
            'gl-label-form': error_message == '',
            'gl-label-form-invalid': error_message !== '',
            required: is_required,
        }" :for="field_name">{{ label_name }}</label>

        <div v-if="inputGroupType" class="flex items-center">

            <label v-if="inputGroupType=='prepend'" v-html="inputGroupText"
                class="h-10 z-10 inline-flex items-center shrink-0 px-4  text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 dark:text-gray-400 rounded-s-lg focus:outline-hidden dark:bg-gray-700 dark:border-gray-600">

            </label>

            <div class="relative w-full">

                <input :minlength="minlength" :maxlength="maxlength" class="rtl:text-right rounded-none!" :required="is_required"
                    :name="field_name" :id="field_name" 


                    
                    :class="{
                        'gl-input-form': error_message == '',
                        'gl-input-form-invalid': error_message !== '',
                        [input_class]: input_class && input_class !== '',
                        'border-e-0! rounded-s-lg!': inputGroupType == 'append',
                        'border-s-0! rounded-e-lg!': inputGroupType == 'prepend'
                    }" :type="type" v-model="proxyValue" @keydown="$emit('keydown', $event)" @keyup="$emit('keyup', $event)"    @blur="$emit('blur-sm', $event)"
                    ref="input" :placeholder="placeholder" />


            </div>

            <label v-if="inputGroupType=='append'" v-html="inputGroupText"
                class="h-10 z-10 inline-flex items-center shrink-0 px-4  text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 dark:text-gray-400 rounded-e-lg focus:outline-hidden dark:bg-gray-700 dark:border-gray-600">

            </label>

        </div>






        <input v-if="inputGroupType==''" :minlength="minlength" :maxlength="maxlength" class="rtl:text-right"
            :required="is_required" :name="field_name" :id="field_name" :class="{
                'gl-input-form': error_message == '',
                'gl-input-form-invalid': error_message !== '',
                [input_class]: input_class && input_class !== ''

            }" :type="type" v-model="proxyValue" @keydown="$emit('keydown', $event)" @keyup="$emit('keyup', $event)" @blur="$emit('blur-sm', $event)"
            ref="input" :placeholder="placeholder" />

        <span class="gl-span-form-error">{{ error_message }}</span>

        <small class="block mt-1 text-sm font-normal leading-5 text-gray-500">
            {{ description }}
        </small>
    </div>
</template>
