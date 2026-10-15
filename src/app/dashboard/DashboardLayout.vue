<template>
  <div class="h-full flex relative">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="isOpen = false"
    ></div>
    <!-- LEFT -->
    <div
      :class="[
        'z-50 fixed top-0 left-0 min-h-screen w-[14%] bg-linear-to-b from-[#0B132B] to-[#1C2541] text-white transition-all ease-in-out duration-300 md:relative',
        isOpen
          ? 'translate-x-0 w-[75%] md:w-[24%] lg:w-[20%] xl:w-[16%]'
          : '-translate-x-96 md:translate-x-0 w-64 md:w-[12%] lg:w-[12%] xl:w-[6%]',
      ]"
    >
      <RouterLink to="/user" class="block p-4">
        <img
          src="../../../public/havenkicks-logo.png"
          class="block w-11 h-8"
          v-if="!isOpen"
        />
        <img
          src="../../../public/havenkicks-full-logo.png"
          class="w-48 h-12"
          v-if="isOpen"
        />
      </RouterLink>
      <div class="block w-full border-b border-slate-700"></div>
      <Menu @toggleSidebar="isOpen = !isOpen" :collapsed="!isOpen" />
    </div>
    <!-- RIGHT -->
    <div class="w-full overflow-auto flex flex-col">
      <Header @toggleSidebar="isOpen = !isOpen" />
      <router-view />
    </div>
  </div>
</template>
<script setup>
import Menu from "@/components/dashboard/Menu.vue";
import { ref } from "vue";
import Header from "@/components/shared/Header.vue";

const isOpen = ref(false);
</script>
