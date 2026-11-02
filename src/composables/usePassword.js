import { ref, reactive } from "vue";
import { changePassword as changePasswordApi } from "../api/users"; // sesuaikan path file api kamu

export function useChangePassword() {
  const form = reactive({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const loading = ref(false);
  const error = ref("");
  const success = ref("");

  const resetForm = () => {
    form.current_password = "";
    form.password = "";
    form.password_confirmation = "";
  };

  const submitChangePassword = async () => {
    loading.value = true;
    error.value = "";
    success.value = "";
    try {
      const data = await changePasswordApi(form);
      success.value = data.message || "Password berhasil diubah";
      resetForm();
      return true;
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.errors?.current_password?.[0] ||
        err.response?.data?.errors?.password?.[0] ||
        "Gagal mengubah password";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { form, loading, error, success, submitChangePassword };
}
