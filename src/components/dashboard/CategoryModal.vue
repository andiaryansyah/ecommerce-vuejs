<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
      <h3 class="text-lg font-semibold mb-4">
        {{
          isEdit
            ? "Edit Category"
            : modalType === "sub"
              ? "Add Sub Category"
              : "Add Category"
        }}
      </h3>

      <div v-if="modalType === 'sub'" class="mb-3">
        <label class="block text-sm font-medium mb-1">Parent Category</label>
        <select
          :value="form.parent_id"
          @change="
            emit('update:form', { ...form, parent_id: $event.target.value })
          "
          class="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
        >
          <option v-for="p in parentCategories" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Category Name</label>
        <input
          :value="form.name"
          @input="emit('update:form', { ...form, name: $event.target.value })"
          @keyup.enter="emit('save')"
          placeholder="e.g. Running"
          class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button
          @click="emit('close')"
          class="px-4 py-2 border rounded-lg text-sm"
        >
          Cancel
        </button>
        <button
          @click="emit('save')"
          :disabled="saving || !form.name.trim()"
          class="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
        >
          <span
            v-if="saving"
            class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          {{ saving ? "Saving..." : isEdit ? "Update" : "Save" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  isEdit: Boolean,
  modalType: { type: String, default: "parent" },
  form: { type: Object, required: true },
  parentCategories: { type: Array, default: () => [] },
  saving: Boolean,
});
const emit = defineEmits(["close", "save", "update:form"]);
</script>
