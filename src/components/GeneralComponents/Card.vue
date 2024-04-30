<template>
  <div class="flex flex-col gap-9">
    <div
      class="bg-white border rounded-lg border-stroke shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="px-3 py-4 border-b border-stroke dark:border-strokedark">
        <h3 class="font-semibold text-black dark:text-white">
          <slot name="header"></slot>
        </h3>
      </div>




      <div v-if="$slots.body" class="p-6">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
};
</script>

<style scoped></style>
