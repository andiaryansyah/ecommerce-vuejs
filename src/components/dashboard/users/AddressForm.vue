<template>
  <div class="bg-white rounded-3xl p-6 border">
    <h2 class="font-semibold text-sm mb-4">Alamat Pengiriman</h2>
    <div class="space-y-3">
      <div class="grid md:grid-cols-2 gap-3">
        <input
          :value="modelValue.recipient_name"
          @input="update('recipient_name', $event.target.value)"
          placeholder="Nama Penerima *"
          class="h-11 rounded-xl border px-4 text-sm w-full"
        />
        <input
          :value="modelValue.phone"
          @input="update('phone', $event.target.value)"
          placeholder="No HP *"
          class="h-11 rounded-xl border px-4 text-sm w-full"
        />
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        <input
          :value="modelValue.province"
          @input="update('province', $event.target.value)"
          placeholder="Provinsi *"
          class="h-11 rounded-xl border px-4 text-sm w-full"
        />
        <input
          :value="modelValue.city"
          @input="update('city', $event.target.value)"
          placeholder="Kota *"
          class="h-11 rounded-xl border px-4 text-sm w-full"
        />
      </div>
      <input
        :value="modelValue.postal_code"
        @input="update('postal_code', $event.target.value)"
        placeholder="Kode Pos"
        class="h-11 rounded-xl border px-4 text-sm w-full"
      />
      <textarea
        :value="modelValue.detail"
        @input="update('detail', $event.target.value)"
        placeholder="Detail alamat lengkap *"
        rows="4"
        class="w-full rounded-xl border p-4 text-sm resize-none"
      ></textarea>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ modelValue: Object });
const emit = defineEmits(["update:modelValue"]);
const update = (key, val) =>
  emit("update:modelValue", { ...props.modelValue, [key]: val });
</script>
