<template>
  <div
    class="bg-slate-50 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
  >
    <div>
      <h1 class="text-2xl font-bold text-zinc-900">My Profile</h1>
      <p class="text-sm text-zinc-500 my-2">
        Manage your information for account security.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Avatar -->
      <div
        class="bg-white rounded-2xl border border-zinc-200 p-8 flex flex-col items-center text-center h-fit"
      >
        <div class="relative group">
          <img
            :src="previewAvatar || user.avatar_url || avatarFallback"
            class="w-24 h-24 rounded-full object-cover ring-4 ring-zinc-100"
          />
          <label
            class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition"
          >
            <span class="text-white text-xs font-medium">Change</span>
            <input
              type="file"
              class="hidden"
              @change="onAvatarChange"
              accept="image/*"
            />
          </label>
        </div>
        <h3 class="mt-4 font-semibold">{{ user.name }}</h3>
        <p class="text-sm text-zinc-500">{{ user.email }}</p>
      </div>

      <!-- Form -->
      <div
        class="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6"
      >
        <form @submit.prevent="handleSave" class="space-y-5">
          <div>
            <label class="text-sm font-medium">Full Name</label>
            <input
              v-model="form.name"
              class="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none"
            />
            <p v-if="errors.name" class="text-xs text-red-500 mt-1">
              {{ errors.name[0] }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium">Email</label>
            <input
              v-model="form.email"
              disabled
              class="mt-2 w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="text-sm font-medium">Phone</label>
              <input
                v-model="form.phone"
                placeholder="+62..."
                class="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none"
              />
            </div>
            <div>
              <label class="text-sm font-medium">Gender</label>
              <select
                v-model="form.gender"
                class="mt-2 w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium">Date of Birth</label>
            <input
              v-model="form.birthday"
              type="date"
              class="mt-2 w-full md:w-1/2 px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none"
            />
          </div>

          <div class="pt-4 flex justify-end">
            <button
              :disabled="loading"
              class="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-black disabled:opacity-50"
            >
              {{ loading ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { fetchProfile, updateProfile } from "../../../api/users";

const loading = ref(false);
const errors = ref({});
const previewAvatar = ref(null);
const avatarFile = ref(null);

const user = reactive({ name: "", email: "", avatar_url: null });
const form = reactive({
  name: "",
  email: "",
  phone: "",
  gender: "",
  birthday: "",
});

const avatarFallback = computed(
  () =>
    `https://ui-avatars.com/api/?name=${form.name || "H"}&background=111827&color=fff`,
);

onMounted(async () => {
  const data = await fetchProfile();
  console.log("data :", data);
  Object.assign(user, data);
  form.name = data.name;
  form.email = data.email;
  form.phone = data.phone || "";
  form.gender = data.gender || "";
  form.birthday = data.birthday || "";
});

const onAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  avatarFile.value = file;
  previewAvatar.value = URL.createObjectURL(file);
};

const handleSave = async () => {
  loading.value = true;
  errors.value = {};
  try {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("phone", form.phone || "");
    fd.append("gender", form.gender || "");
    fd.append("birthday", form.birthday || "");
    if (avatarFile.value) fd.append("avatar", avatarFile.value);

    const updated = await updateProfile(fd);
    Object.assign(user, updated);
    alert("Profile updated!");
  } catch (err) {
    if (err.response?.status === 422) errors.value = err.response.data.errors;
    else alert("Failed to update profile");
  } finally {
    loading.value = false;
  }
};
</script>
