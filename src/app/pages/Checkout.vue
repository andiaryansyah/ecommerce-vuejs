<template>
  <div class="min-h-screen bg-[#f9f9f7]">
    <header class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20">
      <div
        class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center"
      >
        <div class="flex items-center gap-3">
          <button
            @click="router.back()"
            class="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition"
          >
            ←
          </button>
          <h1 class="font-semibold text-[17px] tracking-tight">Checkout</h1>
        </div>
        <div
          class="text-[11px] font-medium px-3 py-1 rounded-full bg-black text-white"
        >
          🔒 Aman & Terjamin
        </div>
      </div>
    </header>

    <div
      class="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[1.7fr_1fr] gap-6 items-start"
    >
      <div class="space-y-5">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
          <h2 class="font-semibold text-[15px] mb-1">Detail Pengiriman</h2>
          <p class="text-[12px] text-gray-400 mb-6">
            Pastikan alamat benar biar kurir gak nyasar
          </p>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="md:col-span-2 space-y-1.5">
              <label class="label">Nama Penerima *</label>
              <input
                v-model="form.recipient_name"
                placeholder="Contoh: Budi Santoso"
                class="input"
              />
            </div>
            <div class="space-y-1.5">
              <label class="label">No. HP / WhatsApp *</label>
              <input
                v-model="form.phone"
                placeholder="08xxxxxxxxxx"
                class="input"
              />
            </div>
            <div class="space-y-1.5">
              <label class="label">Provinsi *</label>
              <input
                v-model="form.province"
                placeholder="Sulawesi Selatan"
                class="input"
              />
            </div>
            <div class="space-y-1.5">
              <label class="label">Kota / Kabupaten *</label>
              <input v-model="form.city" placeholder="Makassar" class="input" />
            </div>
            <div class="space-y-1.5">
              <label class="label">Kode Pos</label>
              <input
                v-model="form.postal_code"
                placeholder="90212"
                class="input"
              />
            </div>
            <div class="md:col-span-2 space-y-1.5">
              <label class="label">Detail Alamat Lengkap *</label>
              <textarea
                v-model="form.detail"
                rows="3"
                placeholder="Jl. Perintis No.10, RT 01/RW 02, dekat masjid..."
                class="input resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
          <h2 class="font-semibold text-[15px] mb-5">
            Pesanan Kamu • {{ cartStore.count }} item
          </h2>
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex gap-4 py-4 border-b border-dashed last:border-0"
          >
            <img
              :src="item.product.image_url"
              class="w-18 h-18 rounded-[14px] object-cover bg-gray-50"
            />
            <div class="flex-1">
              <p class="text-[13.5px] font-medium leading-tight">
                {{ item.product.name }}
              </p>
              <p class="text-[11px] text-gray-500 mt-1">
                Size
                <span class="font-semibold text-black">{{ item.size }}</span> •
                Qty {{ item.quantity }}
              </p>
              <p class="text-[13px] font-semibold mt-2">
                Rp {{ Number(item.product.price).toLocaleString("id-ID") }}
              </p>
            </div>
            <div class="text-[12px] font-semibold">x{{ item.quantity }}</div>
          </div>
        </div>
      </div>

      <div class="lg:sticky lg:top-20">
        <div class="bg-[#111111] text-white rounded-[26px] p-6 shadow-xl">
          <h3 class="font-semibold text-[15px]">Ringkasan Pembayaran</h3>
          <div class="mt-6 space-y-3 text-[13px]">
            <div class="flex justify-between text-white/60">
              <span>Subtotal ({{ cartStore.count }})</span>
              <span class="text-white"
                >Rp {{ cartStore.total.toLocaleString("id-ID") }}</span
              >
            </div>
            <div class="flex justify-between text-white/60">
              <span>Ongkir</span><span class="text-lime-300">Gratis</span>
            </div>
            <div class="h-px bg-white/10 my-4"></div>
            <div class="flex justify-between font-semibold text-[16px]">
              <span>Total</span
              ><span>Rp {{ cartStore.total.toLocaleString("id-ID") }}</span>
            </div>
          </div>
          <button
            @click="doCheckout"
            :disabled="loading || cartStore.count === 0"
            class="w-full mt-7 bg-white text-black rounded-full py-3.5 text-[13.5px] font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            {{
              loading
                ? "Memproses ke Midtrans..."
                : `Bayar Sekarang • Rp ${cartStore.total.toLocaleString("id-ID")}`
            }}
          </button>
          <p
            class="text-[10.5px] text-center text-white/40 mt-3 leading-relaxed"
          >
            Pembayaran aman via Midtrans
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import api from "@/api/axios";

const router = useRouter();
const cartStore = useCartStore();
const loading = ref(false);

const form = reactive({
  recipient_name: "",
  phone: "",
  province: "",
  city: "",
  postal_code: "",
  detail: "",
});

onMounted(async () => {
  if (cartStore.items.length === 0) await cartStore.fetch();
});

const doCheckout = async () => {
  if (!form.recipient_name || !form.phone || !form.city || !form.detail)
    return alert("Lengkapi alamat ya!");
  loading.value = true;
  try {
    const res = await api.post("/checkout", {
      recipient_name: form.recipient_name,
      phone: form.phone,
      province: form.province,
      city: form.city,
      postal_code: form.postal_code,
      detail: form.detail,
      shipping_address: null,
    });
    window.location.href = res.data.payment_url;
  } catch (e) {
    alert(e.response?.data?.message || "Gagal checkout");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #4b5563;
  text-transform: uppercase;
}
.input {
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
}
.input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px #000;
}
.input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}
</style>
