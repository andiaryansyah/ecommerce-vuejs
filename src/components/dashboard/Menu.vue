<template>
  <div class="text-sm relative px-4">
    <div class="flex flex-col gap-2">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="flex flex-col"
      >
        <div v-if="item.visible.includes('admin')">
          <!-- 1. Jika punya href (menu biasa) -->
          <RouterLink v-if="item.href" :to="item.href">
            <div
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-hover cursor-pointer"
              @click="handleClick(item.label, item.subItems.length > 0)"
            >
              <Icon :icon="item.icon" class="w-6 h-6 text-white shrink-0" />
              <span
                v-if="!props.collapsed"
                class="text-sm md:text-base md:block"
              >
                {{ item.label }}
              </span>
              <div v-if="item.subItems.length > 0" class="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  :class="{ 'rotate-90': openDropdown === item.label }"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </RouterLink>

          <!-- 2. Jika TIDAK punya href (parent dropdown kayak Products, My Account) -->
          <div
            v-else
            class="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-hover cursor-pointer"
            @click="handleClick(item.label, item.subItems.length > 0)"
          >
            <Icon :icon="item.icon" class="w-6 h-6 text-white shrink-0" />
            <span v-if="!props.collapsed" class="text-sm md:text-base md:block">
              {{ item.label }}
            </span>
            <div v-if="item.subItems.length > 0" class="ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                :class="{ 'rotate-90': openDropdown === item.label }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <!-- Sub Items -->
          <div
            v-if="item.subItems.length > 0 && !props.collapsed"
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="
              openDropdown === item.label
                ? 'max-h-96 opacity-100 mt-1 ml-6'
                : 'max-h-0 opacity-0'
            "
          >
            <RouterLink
              v-for="sub in item.subItems"
              :key="sub.label"
              :to="sub.href"
              class="flex items-center gap-2 p-2 ml-2 rounded-lg hover:bg-primary-hover cursor-pointer"
              @click="emit('toggleSidebar')"
            >
              <span class="text-sm md:text-base">{{ sub.label }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { menuItems } from "@/data/menuItems.js";

const props = defineProps({ collapsed: Boolean });
const emit = defineEmits(["toggleSidebar"]);

const openDropdown = ref(null);

const handleClick = (label, hasSubItems) => {
  if (props.collapsed && hasSubItems) {
    emit("toggleSidebar");
    openDropdown.value = label;
  } else if (hasSubItems) {
    openDropdown.value = openDropdown.value === label ? null : label;
  }
};

watch(
  () => props.collapsed,
  (val) => {
    if (val) openDropdown.value = null;
  },
);
</script>
