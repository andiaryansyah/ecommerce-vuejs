<template>
  <div class="w-full">
    <div
      class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
    >
      <h2 class="text-xl font-bold text-gray-900">Change Password</h2>
      <p class="text-sm text-gray-500 mt-1">
        Amankan akunmu dengan password yang kuat
      </p>

      <form @submit.prevent="onSubmit" class="mt-6 space-y-5">
        <!-- Loop input biar reusable tanpa bikin file baru -->
        <div v-for="field in fields" :key="field.key">
          <label class="text-sm font-medium text-gray-700">{{
            field.label
          }}</label>
          <div class="relative mt-1.5">
            <input
              :type="show[field.key] ? 'text' : 'password'"
              v-model="form[field.key]"
              :placeholder="field.placeholder"
              class="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a2332] focus:border-transparent outline-none text-sm"
              required
            />
            <button
              type="button"
              @click="show[field.key] = !show[field.key]"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              <Icon
                v-if="show[field.key]"
                icon="akar-icons:eye-slashed"
                class="w-5 h-5"
              />
              <Icon v-else icon="akar-icons:eye-open" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div v-if="error" class="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
          {{ error }}
        </div>
        <div
          v-if="success"
          class="p-3 rounded-xl bg-green-50 text-green-600 text-sm"
        >
          {{ success }}
        </div>

        <button
          :disabled="loading"
          class="px-8 py-2.5 bg-[#1a2332] text-white rounded-xl font-medium hover:bg-[#242f44] disabled:opacity-50 transition"
        >
          {{ loading ? "Menyimpan..." : "Update Password" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { changePassword } from "../../../api/users"; // sesuai file api kamu

// Config field - kalau mau tambah field tinggal tambah di sini
const fields = [
  {
    key: "current_password",
    label: "Current Password",
    placeholder: "Password saat ini",
  },
  { key: "password", label: "New Password", placeholder: "Minimal 8 karakter" },
  {
    key: "password_confirmation",
    label: "Confirm New Password",
    placeholder: "Konfirmasi password baru",
  },
];

const form = reactive({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const show = reactive({
  current_password: false,
  password: false,
  password_confirmation: false,
});

const loading = ref(false);
const error = ref("");
const success = ref("");

const onSubmit = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";
  try {
    const res = await changePassword(form);
    success.value = res.message || "Password berhasil diubah";
    form.current_password = "";
    form.password = "";
    form.password_confirmation = "";
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.response?.data?.errors?.current_password?.[0] ||
      err.response?.data?.errors?.password?.[0] ||
      "Gagal mengubah password";
  } finally {
    loading.value = false;
  }
};
</script>
