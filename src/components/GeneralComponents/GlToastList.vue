<template>
    <TransitionGroup
    tag="div"
    enter-from-class="translate-x-full opacity-0"
    enter-active-class="duration-500"
    leave-active-class="duration-500"
    leave-to-class="translate-x-full opacity-0"
    class="fixed z-50 w-full max-w-xs space-y-4 top-4 right-4">
    <ToastListItem
      v-for="(item, index) in toast.state.items"
      :key="item.key"
      :message="item.message"
      :type="item.type"
      :duration="item.duration"
      @remove="remove(index)"
    />
  </TransitionGroup>
</template>



<script setup>
 import ToastListItem from '/src/components/GeneralComponents/ToastListItem.vue';
 import { ref, watch , onMounted, inject,computed } from 'vue'; // Import ref and watch from Vue

 import toast from "/src/Stores/toast";
 



//const store = useStore(); // use the store

//const items = computed(() => store.state.toast.items);








function remove(index) {
  //store.commit("toast/remove", index);

  toast.methods.remove(index);

}


</script>






