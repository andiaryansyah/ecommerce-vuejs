<template>
  <div class="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
    <div class="max-w-6xl mx-auto grid md:grid-cols-[1.5fr_0.7fr] gap-6">
      <AddressForm v-model="form" />
      <OrderSummary :items="cartItems" :total="total">
        <template #action>
          <button
            @click="doCheckout"
            :disabled="loading"
            class="w-full h-12 mt-6 bg-[#0B132B] text-white rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {{ loading ? "Memproses..." : "Bayar Sekarang" }}
          </button>
        </template>
      </OrderSummary>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import AddressForm from "./components/AddressForm.vue";
import OrderSummary from "./components/OrderSummary.vue";
import api from "@/api/axios.js";
import { useRouter } from "vue-router";

const router = useRouter();
const cartItems = ref([]);
const loading = ref(false);
const form = reactive({
  recipient_name: "",
  phone: "",
  province: "",
  city: "",
  postal_code: "",
  detail: "",
});
const total = computed(() =>
  cartItems.value.reduce((s, c) => s + (c.product?.price || 0) * c.quantity, 0),
);

onMounted(async () => {
  const { data } = await api.get("/carts");
  cartItems.value = data.items || [];
  const user = await api.get("/user");
  form.recipient_name = user.data.name;
});

const doCheckout = async () => {
  if (!form.recipient_name || !form.phone || !form.city || !form.detail)
    return alert("Lengkapi alamat");
  loading.value = true;
  try {
    const { data } = await api.post("/checkout", form);
    if (window.snap)
      window.snap.pay(data.snap_token, {
        onSuccess: () => router.push("/orders"),
      });
    else {
      window.open(data.payment_url, "_blank");
      router.push("/orders");
    }
  } catch (e) {
    alert(e.response?.data?.message);
  } finally {
    loading.value = false;
  }
};
</script>
