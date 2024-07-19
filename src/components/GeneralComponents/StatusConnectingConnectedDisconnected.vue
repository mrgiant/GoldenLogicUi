<template>
  <div class="flex flex-wrap gap-2 text-nowrap">
    <span
      v-if="status === 0"
      class="inline-flex items-center px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300"
      ><span class="relative flex w-2 h-2 mr-1"
        ><span
          class="absolute inline-flex w-full h-full bg-blue-500 rounded-full animate-ping"
        ></span
        ><span
          class="relative inline-flex w-2 h-2 bg-blue-500 rounded-full"
        ></span
      ></span>
      Connecting</span
    >

    <span
      v-if="status === 1"
      class="inline-flex items-center px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300"
    >
      <span class="w-2 h-2 bg-green-500 rounded-full me-1"></span>
      Connected
    </span>

    <span
      v-if="status === 2"
      class="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full dark:bg-red-900 dark:text-red-300"
    >
      <span class="w-2 h-2 bg-red-500 rounded-full me-1"></span>
      Disconnected
    </span>

    <button v-on:click="Reconnect" class="ml-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        class="w-5 h-5"
        style="animation-direction: reverse"
      >
        <path
          fill-rule="evenodd"
          d="M10 1.425c.002-.113-.044-.222-.125-.3L9.708.958C9.63.879 9.523.835 9.412.835s-.218.044-.296.123L6.163 3.9c-.16.165-.16.427 0 .592l2.953 2.942c.078.079.185.123.296.123s.218-.044.296-.123l.167-.167c.081-.078.127-.187.125-.3V5c2.764 0 5.005 2.239 5.005 5 0 .808-.197 1.603-.575 2.317-.086.162-.056.362.075.492l.609.608c.092.091.222.134.35.117s.241-.091.309-.2a6.66 6.66 0 0 0 .002-6.664C14.584 4.607 12.383 3.336 10 3.333V1.425zm.588 11.018c.111 0 .218.044.296.123l2.953 2.942c.16.165.16.427 0 .592l-2.953 2.942c-.078.079-.185.123-.296.123s-.218-.044-.296-.123l-.167-.167c-.082-.078-.127-.187-.125-.3v-1.908c-2.383-.002-4.584-1.274-5.774-3.336a6.66 6.66 0 0 1 .002-6.664c.064-.115.178-.195.309-.217s.258.025.35.117l.617.617c.128.131.159.329.075.492-.386.714-.587 1.513-.584 2.325 0 2.761 2.241 5 5.005 5v-1.967c-.002-.113.044-.222.125-.3l.167-.167c.078-.079.185-.123.296-.123z"
          fill="currentColor"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  status: {
    type: Number,
    default: false,
  },
});

const emit = defineEmits(["reconnect"]);

const Reconnect = () => {
  emit("reconnect");
};
</script>

<style scoped></style>
