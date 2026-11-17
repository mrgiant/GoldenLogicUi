<template>
    <div v-if="visibleActions.length" v-click-outside="close" class="flex lg:justify-center">
        <button
            type="button"
            :aria-label="tdProps?.label ?? 'Actions'"
            aria-haspopup="menu"
            :aria-expanded="open ? 'true' : 'false'"
            class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-hidden dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            @click="toggle"
        >
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                <path
                    d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
            </svg>
        </button>

        <ul
            v-show="open"
            ref="menu"
            role="menu"
            :style="style"
            class="fixed z-50 py-2 text-sm text-gray-700 bg-white border rounded-lg shadow-lg min-w-44 max-w-xs dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        >
            <li v-for="act in visibleActions" :key="act.key" role="none">
                <a
                    v-if="act.href"
                    role="menuitem"
                    :href="act.href(row)"
                    :target="act.target || undefined"
                    class="flex items-center px-4 py-2 whitespace-nowrap"
                    :class="itemClass(act)"
                    @click="close"
                >
                    <i v-if="act.icon" class="w-4 opacity-80 me-2" :class="act.icon" aria-hidden="true"></i>
                    {{ act.label }}
                </a>
                <button
                    v-else
                    type="button"
                    role="menuitem"
                    :disabled="isDisabled(act)"
                    class="flex items-center w-full px-4 py-2 whitespace-nowrap text-start disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="itemClass(act)"
                    @click="trigger(act)"
                >
                    <i v-if="act.icon" class="w-4 opacity-80 me-2" :class="act.icon" aria-hidden="true"></i>
                    {{ act.label }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, getCurrentInstance } from "vue";
import { useGlFloatingMenu } from "./useGlFloatingMenu.js";

/**
 * A row's menu of any actions, for a DataTable column's tdComp. It opens
 * over the page, so the table never clips it.
 *
 * tdProps: {
 *   actions: Array | (row) => Array of {
 *     key, label, icon?, danger?,
 *     permission?: a permission the user must have, as can() reads it,
 *     show?(row), disabled?(row),
 *     href?(row), target?: a link instead of a button,
 *   },
 *   onAction?(key, row): called for an action without href; xprops.onAction is used when
 *     absent, and with neither the table emits cell-action { action: key, row },
 *   label?: the button's accessible name, "Actions" by default,
 * }
 */
const props = defineProps({
    field: { type: String, default: "" },
    row: { type: [Array, Object], default: () => ({}) },
    xprops: { type: Object, default: () => ({}) },
    tdProps: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["cellAction"]);

const { open, menu, style, toggle, close } = useGlFloatingMenu();

const proxy = getCurrentInstance()?.proxy;
const allowed = (permission) => !permission || typeof proxy?.can !== "function" || proxy.can(permission);

const visibleActions = computed(() => {
    const actions = typeof props.tdProps?.actions === "function" ? props.tdProps.actions(props.row) : props.tdProps?.actions || [];

    return actions.filter((act) => allowed(act.permission) && (!act.show || act.show(props.row)));
});

const isDisabled = (act) => (act.disabled ? Boolean(act.disabled(props.row)) : false);

const itemClass = (act) =>
    act.danger
        ? "text-red-600 hover:text-white hover:bg-red-600 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600"
        : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white";

const trigger = (act) => {
    close();

    if (isDisabled(act)) {
        return;
    }

    const handler = props.tdProps?.onAction || props.xprops?.onAction;

    if (handler) {
        handler(act.key, props.row);

        return;
    }

    // The table hands it on as cell-action: { action: key, row }.
    emit("cellAction", act.key);
};
</script>
