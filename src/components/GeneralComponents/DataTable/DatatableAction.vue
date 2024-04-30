<template>
    <DeleteConfirmationModal
        :isOpen="open_delete_modal"
        @confirm-delete="deleteAction"
        @cancel-delete="closeDeleteModal"
    />

    <div
        v-if="
            row &&
            can(`edit_${xprops.permission} || delete_${xprops.permission}`)
        "
        v-click-outside="closeDropdown"
        class="flex justify-center"
    >
        <button
            v-on:click="openDropdown"
            class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            type="button"
        >
            <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 4 15"
            >
                <path
                    d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
            </svg>
        </button>

        <div
            v-show="open"
            class="absolute z-10 mt-5 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
            <ul
                class="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDividerButton"
            >
                <li v-if="can(`edit_${xprops.permission}`)">
                    <a
                        :href="xprops.route + '/' + row['id'] + '/edit'"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <i class="mr-2 fa-solid fa-list-ul opacity-80"></i>
                        Edit</a
                    >
                </li>

                <li v-if="can(`delete_${xprops.permission}`)">
                    <a
                        href="#"
                        v-on:click.prevent="openDeleteModal"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <i class="mr-2 fa-solid fa-trash-can opacity-80"></i>
                        Remove</a
                    >
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex"; // import useStore from Vuex
import DeleteConfirmationModal from "@/components/GeneralComponents/DeleteConfirmationModal.vue";

const store = useStore(); // use the store

const props = defineProps({
    field: {
        type: String,
        default: "",
    },

    route_url: {
        type: String,
        default: "",
    },

    row: {
        type: [Array, Object],
        default: [],
    },
    xprops: {
        type: Object,
        default: {},
    },

    tdProps: {
        type: Object,
        default: {},
    },
});

const open = ref(false);
const open_delete_modal = ref(false);

const closeDropdown = () => {
    open.value = false;
};

const openDropdown = () => {
    open.value = true;
};

const closeDeleteModal = () => {
    open_delete_modal.value = false;
};

const openDeleteModal = () => {
    open_delete_modal.value = true;
};

const emit = defineEmits(["deleteAction"]);

const deleteAction = () => {
    axios
        .delete(`${props.xprops.route}/${props.row["id"]}`)
        .then(() => {
            closeDeleteModal();
            emit("deleteAction");
            // handle successful delete
            store.commit("notification/SHOW_NOTIFICATION", {
                message: "Item deleted successfully.",
                type: "success",
                duration: 5000,
            });
        })
        .catch((error) => {
            // handle error
            console.log(error);
        });
};
</script>

<style scoped></style>
