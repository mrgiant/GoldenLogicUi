import { reactive } from "vue";

const state = reactive({
    items: [],
});

const methods = {
    add(toast) {
        state.items.unshift({
            key: Symbol(),
            message: toast.message,
            type: toast.type,
            duration: toast.duration,
        });
    },
    remove(index) {
        state.items.splice(index, 1);
    },
};

export default {
    state,
    methods,
};
