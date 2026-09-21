<template>
  <Header @toggleSidebar="isOpen = !isOpen" />
  <div class="h-full flex relative">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="isOpen = false"
    ></div>
    <!-- LEFT -->
    <div
      :class="[
        'z-50 fixed top-0 left-0 min-h-screen w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-linear-to-b from-[#0B132B] to-[#1C2541] text-white not-first:transition-transform duration-300',
        isOpen ? 'translate-x-0 w-[75%]' : '-translate-x-96 w-64',
        'md:translate-x-0 md:relative md:w-[14%]',
      ]"
    >
      <RouterLink to="/" class="flex items-center justify-start gap-3 p-4">
        <div class="block md:hidden">
          <img
            src="../../../public/havenkicks-logo.png"
            class="block w-11 h-8"
          />
        </div>
        <div class="block md:hidden">
          <span class="block font-semibold text-secondary">Haven Kicks</span>
          <span class="block">Dashboard</span>
        </div>
      </RouterLink>
      <div class="block md:hidden w-full border-b border-slate-700 my-2"></div>
      <Menu @toggleSidebar="isOpen = false" />
    </div>
    <!-- RIGHT -->
    <div
      class="w-full md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-auto flex flex-col"
    >
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
