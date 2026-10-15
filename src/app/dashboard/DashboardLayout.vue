<template>
  <div class="h-screen flex bg-[#F1F5F9] overflow-hidden">
    <!-- Overlay Mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
      @click="isOpen = false"
    ></div>

    <!-- LEFT SIDEBAR -->
    <aside
      :class="[
        'z-50 fixed md:sticky top-0 h-screen flex flex-col bg-[#0B132B] text-white transition-all duration-300 ease-in-out shrink-0',
        isOpen
          ? 'translate-x-0 w-70'
          : '-translate-x-full md:translate-x-0 md:w-18',
        !isOpen ? 'md:w-18' : 'md:w-70',
      ]"
    >
      <!-- Logo Area -->
      <div
        class="h-16 flex items-center px-4 shrink-0 border-b border-white/10"
      >
        <RouterLink
          to="/admin"
          class="flex items-center gap-3 w-full overflow-hidden"
        >
          <img
            v-if="isOpen"
            src="/havenkicks-full-logo.png"
            class="h-10 w-auto object-contain transition-all"
            alt="full logo"
          />
          <img
            v-else
            src="/havenkicks-logo.png"
            class="w-9 h-9 object-contain shrink-0"
            alt="logo"
          />
        </RouterLink>
      </div>

      <!-- Menu Area with proper padding -->
      <div class="flex-1 overflow-y-auto py-4 px-3">
        <Menu @toggleSidebar="isOpen = !isOpen" :collapsed="!isOpen" />
      </div>

      <!-- Footer tipis -->
      <div class="p-3 border-t border-white/10">
        <div v-if="isOpen" class="text-[10px] text-white/40 text-center">
          © 2026 Haven Kicks
        </div>
      </div>
    </aside>

    <!-- RIGHT CONTENT -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header @toggleSidebar="isOpen = !isOpen" />
      <main class="flex-1 overflow-y-auto p-3 md:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Menu from "@/components/dashboard/Menu.vue";
import { ref } from "vue";
import Header from "@/components/shared/Header.vue";
const isOpen = ref(true); // default kebuka di desktop
</script>
