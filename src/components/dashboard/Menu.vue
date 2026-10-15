<template>
  <div :class="['flex flex-col gap-1.5', isAdmin ? 'mt-8' : '']">
    <div v-for="item in menuItems" :key="item.label">
      <div v-if="item.visible.includes(currentRole)">
        <RouterLink v-if="item.href" :to="item.href" v-slot="{ isActive }">
          <div
            :class="[
              'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm',
              isActive
                ? 'bg-white/10 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
              collapsed ? 'justify-center' : '',
            ]"
          >
            <Icon :icon="item.icon" class="w-5 h-5 shrink-0" />
            <span v-if="!collapsed" class="flex-1 truncate">{{
              item.label
            }}</span>
          </div>
        </RouterLink>

        <div
          v-else
          @click="handleClick(item.label, item.subItems.length > 0)"
          :class="[
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm text-white/70 hover:bg-white/10 hover:text-white',
            openDropdown === item.label,
            collapsed ? 'justify-center' : '',
          ]"
        >
          <Icon :icon="item.icon" class="w-5 h-5 shrink-0" />
          <span v-if="!collapsed" class="flex-1 truncate">{{
            item.label
          }}</span>
          <Icon
            v-if="!collapsed && item.subItems.length"
            icon="lucide:chevron-right"
            class="w-4 h-4 ml-auto transition-transform"
            :class="openDropdown === item.label ? 'rotate-90' : ''"
          />
        </div>

        <div
          v-if="item.subItems.length && !collapsed"
          class="grid transition-all duration-300 ease-in-out"
          :class="
            openDropdown === item.label
              ? 'grid-rows-[1fr] opacity-100 mt-1.5'
              : 'grid-rows-[0fr] opacity-0'
          "
        >
          <div class="overflow-hidden">
            <div
              class="ml-3 pl-5 border-l border-white/10 flex flex-col gap-1 py-1"
            >
              <RouterLink
                v-for="sub in item.subItems"
                :key="sub.label"
                :to="sub.href"
                v-slot="{ isActive }"
              >
                <div
                  :class="[
                    'px-3 py-2 rounded-lg text-[13px] transition-all',
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                  ]"
                >
                  {{ sub.label }}
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { menuItems } from "@/data/menuItems.js";

const props = defineProps({ collapsed: Boolean });
const emit = defineEmits(["toggleSidebar"]);

const role = ref("admin");

const currentRole = computed(() => {
  return role.value === "admin" ? "admin" : "user";
});
const isAdmin = computed(() => currentRole.value === "admin");

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
