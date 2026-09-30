import { ref, computed } from "vue";

const visible = ref(false);
const message = ref("");
const type = ref("success");

const toastClass = computed(() => {
  switch (type.value) {
    case "success":
      return "bg-emerald-600";
    case "error":
      return "bg-red-600";
    case "info":
      return "bg-blue-600";
    default:
      return "bg-gray-600";
  }
});

export function useToast() {
  const showToast = (text, variant = "success") => {
    message.value = text;
    type.value = variant;
    visible.value = true;
    setTimeout(() => (visible.value = false), 2500);
  };
  return { visible, message, toastClass, showToast };
}
