<template>
  <div :class="['flex flex-col gap-1.5', isAdmin ? 'mt-8' : '']">
    <div v-for="item in menuItems" :key="item.label">
      <div v-if="item.visible.includes(currentRole)">
        <RouterLink
          v-if="item.href"
          :to="resolveHref(item.href)"
          v-slot="{ isActive, isExactActive }"
        >
          <div
            :class="[
              'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm',
              isLinkActive(resolveHref(item.href), isActive, isExactActive)
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
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm',
            isParentActive(item)
              ? 'bg-white/10 text-white font-semibold'
              : 'text-white/70 hover:bg-white/10 hover:text-white',
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
            :class="
              openDropdown === item.label || isParentActive(item)
                ? 'rotate-90'
                : ''
            "
          />
        </div>

        <!-- SUB MENU -->
        <div
          v-if="item.subItems.length && !collapsed"
          class="grid transition-all duration-300 ease-in-out"
          :class="
            openDropdown === item.label || isParentActive(item)
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
                :to="resolveHref(sub.href)"
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
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { menuItems } from "@/data/menuItems.js";
import { useAuthStore } from "@/stores/auth";
import { Icon } from "@iconify/vue";

const props = defineProps({ collapsed: Boolean });
const emit = defineEmits(["toggleSidebar"]);

const route = useRoute();
const auth = useAuthStore();

const openDropdown = ref(null);

// ambil role dari auth store kamu, fallback localStorage
const currentRole = computed(() => {
  return (
    auth.user?.role ||
    JSON.parse(localStorage.getItem("user") || "{}")?.role ||
    "user"
  );
});
const isAdmin = computed(() => currentRole.value === "admin");

const resolveHref = (href) => {
  if (!href) return "#";
  if (href === "/settings" || href === "/settings/") {
    return currentRole.value === "admin" ? "/admin/settings" : "/user/settings";
  }
  return href;
};

const isLinkActive = (href, isActive, isExactActive) => {
  if (
    href === "/admin" ||
    href === "/admin/" ||
    href === "/" ||
    href === "/admin/settings" ||
    href === "/user/settings"
  ) {
    return isExactActive;
  }
  return isActive;
};

const isParentActive = (item) => {
  if (!item.subItems?.length) return false;
  return item.subItems.some((sub) =>
    route.path.startsWith(resolveHref(sub.href)),
  );
};

const syncDropdownWithRoute = () => {
  const parent = menuItems.find((item) =>
    item.subItems?.some((sub) => route.path.startsWith(resolveHref(sub.href))),
  );
  if (parent) {
    openDropdown.value = parent.label;
  }
};

onMounted(syncDropdownWithRoute);
watch(() => route.path, syncDropdownWithRoute);

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
    else syncDropdownWithRoute();
  },
);
</script>
