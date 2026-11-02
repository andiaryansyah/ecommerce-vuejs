<template>
  <div class="min-h-screen flex bg-background">
    <!-- KIRI -->
    <div
      class="hidden lg:flex w-1/2 flex-col justify-center p-12 xl:p-16 text-white relative"
      style="background: var(--color-primary-gradient)"
    >
      <div
        class="absolute top-12 left-12 xl:left-16 flex items-center gap-3 font-bold text-xl tracking-widest"
      >
        <RouterLink to="/">
          <img
            src="../../../public/havenkicks-full-logo.png"
            alt="havenkicks"
            class="w-[35%] h-auto"
          />
        </RouterLink>
      </div>

      <div class="max-w-115">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-secondary text-[11px] tracking-widest mb-6 border border-white/10"
        >
          <span class="w-2 h-2 bg-success rounded-full animate-pulse"></span>
          NEW DROP AVAILABLE
        </div>
        <h1 class="text-[44px] font-bold leading-[0.95] text-surface">
          Langkah pertama menuju
          <span class="text-secondary">koleksi</span> terbaikmu.
        </h1>
        <p class="mt-5 text-whisper-blue/60 leading-relaxed text-[15px]">
          Daftar sekarang dan dapatkan akses awal untuk rilis sepatu limited,
          voucher member, dan free shipping.
        </p>

        <div class="mt-10 flex gap-3">
          <div
            class="bg-surface rounded-2xl p-3 flex items-center gap-3 w-65 shadow-lg"
          >
            <div
              class="w-14 h-14 bg-background rounded-xl flex items-center justify-center text-xl"
            >
              👟
            </div>
            <div class="leading-tight">
              <p class="text-heading text-sm font-semibold">Aero Runner v2</p>
              <p class="text-body text-[11px] mt-0.5">
                + 1.2k terjual minggu ini
              </p>
              <p class="text-primary text-xs font-bold mt-1">IDR 899K</p>
            </div>
          </div>
          <div
            class="bg-summer rounded-2xl px-4 py-3 flex flex-col justify-center"
          >
            <p class="text-summer-text text-[10px] font-bold tracking-widest">
              MEMBER
            </p>
            <p class="text-heading font-bold text-sm">-15% OFF</p>
            <p class="text-summer-text text-xs">First Order</p>
          </div>
        </div>
      </div>

      <div
        class="absolute bottom-12 left-12 xl:left-16 flex items-center gap-4"
      >
        <p class="text-[11px] text-whisper-blue/40 tracking-widest">
          TRUSTED BY 50K+ SNEAKERHEADS
        </p>
        <div class="flex -space-x-2">
          <div
            class="w-6 h-6 rounded-full bg-whisper-blue border-2 border-primary"
          ></div>
          <div
            class="w-6 h-6 rounded-full bg-secondary border-2 border-primary"
          ></div>
          <div
            class="w-6 h-6 rounded-full bg-pastel-pink border-2 border-primary"
          ></div>
        </div>
      </div>
    </div>

    <!-- KANAN - SEKARANG SIMETRIS -->
    <div
      class="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-12 xl:p-16 bg-surface lg:bg-background"
    >
      <div class="w-full max-w-110 mx-auto">
        <div class="mb-10">
          <h2 class="text-[30px] font-bold text-heading leading-tight">
            Buat akun baru
          </h2>
          <p class="text-sm text-body mt-2">
            Sudah punya akun?
            <RouterLink
              to="/login"
              class="text-primary font-semibold hover:text-primary-hover underline-offset-4 hover:underline"
              >Login disini</RouterLink
            >
          </p>
        </div>

        <div
          v-if="errorMsg"
          class="mb-5 bg-pastel-pink text-deep-red text-sm p-3.5 rounded-xl border"
        >
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div class="space-y-2">
            <label class="text-[11px] font-bold tracking-widest text-heading"
              >NAMA LENGKAP</label
            >
            <input
              v-model="form.name"
              required
              placeholder="Nama Lengkap"
              class="w-full h-12 px-4 rounded-xl border border-paleSilver bg-surface focus:border-secondary focus:ring-2 focus:ring-summer outline-none text-heading placeholder:text-body/40 text-sm"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[11px] font-bold tracking-widest text-heading"
              >EMAIL</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="nama@email.com"
              class="w-full h-12 px-4 rounded-xl border border-paleSilver bg-surface focus:border-secondary focus:ring-2 focus:ring-summer outline-none text-heading placeholder:text-body/40 text-sm"
            />
          </div>

          <!-- GRID SIMETRIS -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="flex justify-between items-center h-3.5">
                <label
                  class="text-[11px] font-bold tracking-widest text-heading"
                  >PASSWORD</label
                >
                <button
                  type="button"
                  class="text-[11px] text-body hover:text-body-hover"
                  @click="showPassword = !showPassword"
                >
                  <Icon
                    v-if="showPassword"
                    icon="akar-icons:eye-slashed"
                    class="w-5 h-5"
                  />
                  <Icon v-else icon="akar-icons:eye-open" class="w-5 h-5" />
                </button>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="8+ karakter"
                class="w-full h-12 px-4 rounded-xl border border-paleSilver bg-surface focus:border-secondary focus:ring-2 focus:ring-summer outline-none text-heading placeholder:text-body/40 text-sm"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-[11px] font-bold tracking-widest text-heading h-3.5 flex items-center"
                >ULANGI PASSWORD</label
              >
              <input
                v-model="form.password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Ulangi password"
                class="w-full h-12 px-4 rounded-xl border border-paleSilver bg-surface focus:border-secondary focus:ring-2 focus:ring-summer outline-none text-heading placeholder:text-body/40 text-sm"
              />
            </div>
          </div>

          <label class="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              required
              class="mt-1 rounded border-paleSilver text-primary focus:ring-secondary"
            />
            <span class="text-xs text-body leading-relaxed"
              >Saya setuju dengan
              <a href="#" class="text-heading underline">Syarat Layanan</a> dan
              ingin mendapatkan info drop sepatu terbaru.</span
            >
          </label>

          <button
            :disabled="auth.loading"
            class="w-full h-12 bg-primary hover:bg-primary-hover text-surface rounded-xl font-semibold tracking-wide transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span
              v-if="auth.loading"
              class="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin"
            ></span>
            {{ auth.loading ? "Membuat akun..." : "Buat Akun & Klaim -15%" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { RouterLink } from "vue-router";

const auth = useAuthStore();
const showPassword = ref(false);
const errorMsg = ref("");

const form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const handleRegister = async () => {
  errorMsg.value = "";
  if (form.password !== form.password_confirmation) {
    errorMsg.value = "Konfirmasi password tidak sama";
    return;
  }
  try {
    await auth.register(form);
  } catch (err) {
    errorMsg.value =
      err.response?.data?.message || "Gagal mendaftar, coba lagi";
  }
};
</script>
