<template>
  <div class="min-h-screen flex bg-background">
    <!-- Kiri - Branding pakai primary-gradient kamu -->
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
          WELCOME BACK
        </div>
        <h1 class="text-[42px] font-bold leading-[1.1] text-surface">
          Masuk dan lanjutkan<br />
          <span class="text-secondary">perjalanan</span> belanjamu.
        </h1>
        <p class="mt-5 text-whisper-blue/60 leading-relaxed text-[15px]">
          Kelola pesanan, alamat, dan voucher kamu di satu tempat. Aman & cepat.
        </p>
      </div>

      <div
        class="absolute bottom-12 left-12 xl:left-16 flex items-center gap-4"
      >
        <p class="text-sm text-whisper-blue/40">
          © 2026 Havenkicks. Crafted with your design system.
        </p>
      </div>
    </div>

    <!-- Kanan - Form pakai surface kamu -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div
        class="w-full max-w-100 bg-surface lg:bg-transparent p-8 lg:p-0 rounded-3xl lg:rounded-none border border-paleSilver lg:border-0"
      >
        <div class="mb-8">
          <h2 class="text-[28px] font-bold text-heading leading-tight">
            Login ke akun kamu
          </h2>
          <p class="text-sm text-body mt-2">
            Belum punya akun?
            <RouterLink
              to="/register"
              class="text-primary font-semibold hover:text-primary-hover underline-offset-4 hover:underline"
              >Daftar disini</RouterLink
            >
          </p>
        </div>

        <div
          v-if="errorMsg"
          class="mb-4 bg-pastel-pink text-deep-red text-sm p-3.5 rounded-xl border border-pastel-pink"
        >
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="text-[13px] font-semibold text-heading tracking-wide"
              >EMAIL</label
            >
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="nama@email.com"
              class="mt-2 w-full px-4 py-3.5 rounded-xl border border-paleSilver bg-surface focus:border-secondary focus:ring-2 focus:ring-summer outline-none transition text-heading placeholder:text-body/50"
            />
          </div>

          <div>
            <div class="flex justify-between items-center">
              <label
                class="text-[13px] font-semibold text-heading tracking-wide"
                >PASSWORD</label
              >
              <button
                type="button"
                class="text-xs font-medium text-body hover:text-body-hover"
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
              placeholder="Minimal 8 karakter"
              class="mt-2 w-full px-4 py-3.5 rounded-xl border border-paleSilver bg-surface focus:border-secondary focus:ring-2 focus:ring-summer outline-none transition text-heading placeholder:text-body/50"
            />
            <div class="mt-3 text-right">
              <a href="#" class="text-xs text-body hover:text-primary"
                >Lupa password?</a
              >
            </div>
          </div>

          <button
            :disabled="auth.loading"
            class="w-full bg-primary hover:bg-primary-hover text-surface py-3.5 rounded-xl font-medium tracking-wide transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span
              v-if="auth.loading"
              class="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin"
            ></span>
            {{ auth.loading ? "Memproses..." : "Masuk" }}
          </button>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-paleSilver"></div>
            </div>
            <div class="relative flex justify-center">
              <span
                class="bg-surface lg:bg-background px-3 text-xs text-body tracking-widest"
                >ATAU</span
              >
            </div>
          </div>

          <button
            type="button"
            class="w-full border border-paleSilver bg-surface hover:bg-surface-hover py-3.5 rounded-xl font-medium text-heading text-sm transition"
          >
            Daftar dengan Google
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { RouterLink } from "vue-router";

const auth = useAuthStore();
const showPassword = ref(false);
const errorMsg = ref("");

const form = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  errorMsg.value = "";
  try {
    await auth.login(form);
  } catch (err) {
    errorMsg.value = err.response?.data?.message || "Email atau password salah";
  }
};
</script>
