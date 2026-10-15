<template>
  <div class="px-2 md:p-6">
    <!-- Header - UI TETAP -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Categories</h1>
        <p class="text-sm text-gray-500 mt-1">
          Manage your product categories and sub-categories
        </p>
      </div>
      <button
        @click="emit('add-parent')"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer"
      >
        <span class="text-lg leading-none">+</span> Add Category
      </button>
    </div>

    <!-- Search - UI TETAP -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="relative max-w-md">
        <input
          v-model="search"
          placeholder="Search categories..."
          class="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
        <svg
          class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Loading - UI TETAP -->
    <div
      v-if="loading"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-20 flex justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <Loading class="w-10 h-10" color="text-emerald-500" />
        <span class="text-sm text-gray-500">Loading categories...</span>
      </div>
    </div>

    <div
      v-else
      class="bg-white p-2 md:p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <!-- Table - UI TETAP + dropdown -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead
              class="border-b border-gray-200 bg-gray-50 text-gray-600 text-xs uppercase"
            >
              <tr>
                <th class="text-left px-6 py-4 font-medium">Category Name</th>
                <th class="text-left px-6 py-4 font-medium">Type</th>
                <th class="text-left px-6 py-4 font-medium">Sub Categories</th>
                <th class="text-left px-6 py-4 font-medium">Slug</th>
                <th class="text-right px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-for="parent in paginatedParents" :key="parent.id">
                <!-- Parent Row - sekarang bisa di klik untuk dropdown -->
                <tr
                  class="hover:bg-gray-50/70 cursor-pointer"
                  @click="toggleParent(parent.id)"
                >
                  <td
                    class="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2"
                  >
                    <!-- Chevron dropdown -->
                    <svg
                      :class="[
                        'w-4 h-4 text-gray-400 transition-transform duration-200',
                        expandedParents.has(parent.id) ? 'rotate-90' : '',
                      ]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {{ capitalize(parent.name) }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium"
                      >Parent</span
                    >
                  </td>
                  <td class="px-6 py-4 text-gray-500">
                    <span> {{ getSubs(parent.id).length }} items </span>
                  </td>
                  <td class="px-6 py-4 text-gray-500">{{ parent.slug }}</td>
                  <td class="px-6 py-4" @click.stop>
                    <div class="flex justify-end gap-2">
                      <button
                        @click="emit('add-sub', parent.id)"
                        class="px-3 cursor-pointer rounded-md shadow-lg bg-emerald-500 hover:bg-emerald-600"
                      >
                        <span class="text-white text-lg font-bold">+</span>
                      </button>
                      <button
                        @click="emit('edit', parent)"
                        class="p-2 cursor-pointer rounded-md shadow-lg bg-white hover:bg-gray-200"
                      >
                        <Icon
                          icon="akar-icons:edit"
                          class="w-5 h-5 text-blue-400"
                        />
                      </button>
                      <button
                        @click="emit('delete', parent.id)"
                        class="p-2 cursor-pointer rounded-md shadow-lg bg-white hover:bg-gray-200"
                      >
                        <Icon
                          icon="ep:delete-filled"
                          class="w-5 h-5 text-red-500"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
                <!-- Sub Categories - cuma muncul kalau parent di expand -->
                <template v-if="expandedParents.has(parent.id)">
                  <tr
                    v-for="sub in getSubs(parent.id)"
                    :key="sub.id"
                    class="bg-gray-50/30 hover:bg-gray-50"
                  >
                    <td
                      class="px-6 py-3 pl-12 text-gray-600 flex items-center gap-2"
                    >
                      <span class="w-4 h-px bg-gray-300"></span>
                      {{ capitalize(sub.name) }}
                    </td>
                    <td class="px-6 py-3">
                      <span
                        class="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs"
                        >Sub</span
                      >
                    </td>
                    <td class="px-6 py-3 text-gray-400">—</td>
                    <td class="px-6 py-3 text-gray-500">{{ sub.slug }}</td>
                    <td class="px-6 py-3">
                      <div class="flex justify-end gap-2">
                        <button
                          @click="emit('edit', sub)"
                          class="p-2 cursor-pointer rounded-md shadow-lg bg-white hover:bg-gray-200"
                        >
                          <Icon
                            icon="akar-icons:edit"
                            class="w-5 h-5 text-blue-400"
                          />
                        </button>
                        <button
                          @click="emit('delete', sub.id)"
                          class="p-2 cursor-pointer rounded-md shadow-lg bg-white hover:bg-gray-200"
                        >
                          <Icon
                            icon="ep:delete-filled"
                            class="w-5 h-5 text-red-500"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-if="getSubs(parent.id).length === 0"
                    class="bg-gray-50/30"
                  >
                    <td
                      colspan="5"
                      class="px-6 py-3 pl-12 text-gray-400 text-xs"
                    >
                      No sub categories yet.
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
          <div
            v-if="paginatedParents.length === 0"
            class="py-16 text-center text-gray-500 text-sm"
          >
            No categories found.
          </div>
        </div>
      </div>

      <!-- Pagination  -->
      <div
        class="flex justify-between items-center mt-4 text-xs md:text-sm p-2 md:px-0"
      >
        <div
          class="flex flex-col md:flex-row items-start md:items-center gap-2"
        >
          <label class="mr-2">Items per page:</label>
          <select
            v-model.number="itemsPerPage"
            class="border rounded px-2 py-1 bg-white"
          >
            <option v-for="opt in [5, 10, 20]" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
        <div class="flex justify-center items-center">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 border rounded disabled:opacity-50',
              currentPage === 1
                ? 'cursor-not-allowed'
                : 'cursor-pointer hover:bg-primary-hover hover:text-white',
            ]"
          >
            <Icon icon="boxicons:arrow-big-left-line-filled" class="w-5 h-5" />
          </button>
          <span class="px-3 py-1 text-center"
            >Page {{ currentPage }} of {{ totalPages || 1 }}</span
          >
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages || totalPages === 0"
            :class="[
              'px-3 py-1 border rounded disabled:opacity-50 ',
              currentPage === totalPages || totalPages === 0
                ? 'cursor-not-allowed'
                : 'cursor-pointer hover:bg-primary-hover hover:text-white',
            ]"
          >
            <Icon icon="boxicons:arrow-big-right-line-filled" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Loading from "../shared/Loading.vue";

const props = defineProps({
  categories: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["add-parent", "add-sub", "edit", "delete", "search"]);

const search = ref("");
const itemsPerPage = ref(5);
const currentPage = ref(1);

// DROPDOWN STATE - ini tambahan nya
const expandedParents = ref(new Set());

const toggleParent = (id) => {
  const newSet = new Set(expandedParents.value);
  if (newSet.has(id)) newSet.delete(id);
  else newSet.add(id);
  expandedParents.value = newSet;
};

const parents = computed(() => props.categories.filter((c) => !c.parent_id));
const totalPages = computed(() =>
  Math.ceil(parents.value.length / itemsPerPage.value),
);
const paginatedParents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return parents.value.slice(start, start + itemsPerPage.value);
});

const getSubs = (parentId) =>
  props.categories.filter((c) => c.parent_id === parentId);
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
});
watch(
  () => props.categories,
  () => {
    currentPage.value = 1;
  },
);
watch(search, (val) => emit("search", val));
</script>
