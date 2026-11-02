import { defineStore } from "pinia";
import api from "@/api/axios.js";
const isTempId = (id) => String(id).startsWith("temp_");
const genTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    total: 0,
    count: 0,
    isInitialLoading: false,
    updatingSizeMap: {},
    pendingQty: {},
    pendingSize: {},
    qtyQueue: {},
    sizeQueue: {},
    committingTempMap: {},
  }),
  getters: {
    hasUnselectedSize: (s) => s.items.some((i) => !i.size),
    isCheckoutDisabled: (s) =>
      s.isInitialLoading ||
      s.items.length === 0 ||
      s.items.some((i) => !i.size) ||
      Object.keys(s.committingTempMap).length > 0,
    getStockForItem: () => (item) => {
      if (!item.product?.variants?.length) return 9999;
      if (!item.size) return 9999;
      const v = item.product.variants.find(
        (x) => String(x.size) === String(item.size),
      );
      return v ? v.stock : 9999;
    },
    isQtyUpdating: (s) => (id) => !!s.qtyQueue[id],
    isSizeUpdating: (s) => (id) => !!s.updatingSizeMap[id],
    isCommitting: (s) => (id) => !!s.committingTempMap[id],
  },
  actions: {
    async fetch() {
      this.isInitialLoading = true;
      try {
        const { data } = await api.get("/carts");
        const serverItems = data.carts || [];

        const localTemps = this.items.filter(
          (i) => isTempId(i.id) && (!i.size || this.committingTempMap[i.id]),
        );
        const uniq = [];
        const seen = new Set();
        for (const t of localTemps) {
          const key = t.product_id + "_" + (t.size || "empty");
          if (!seen.has(key)) {
            uniq.push(t);
            seen.add(key);
          }
        }

        const serverSizeSet = new Set(
          serverItems.map((i) => i.product_id + "_" + String(i.size)),
        );
        const filteredTemps = uniq.filter(
          (t) =>
            !serverSizeSet.has(t.product_id + "_" + String(t.size)) || !t.size,
        );

        this.items = [
          ...serverItems,
          ...filteredTemps.filter(
            (t) => !t.size || this.committingTempMap[t.id],
          ),
        ];
        this.total = data.total_price || 0;
        this.count = data.count || 0;
        this.saveCache();
      } finally {
        this.isInitialLoading = false;
      }
    },
    saveCache() {
      try {
        localStorage.setItem(
          "cart_cache",
          JSON.stringify(this.items.filter((i) => !isTempId(i.id))),
        );
      } catch {}
    },

    async add(product, size = null) {
      const product_id = typeof product === "object" ? product.id : product;
      const sizeStr = size ? String(size) : null;
      if (sizeStr) {
        const exists = this.items.some(
          (i) =>
            !isTempId(i.id) &&
            i.product_id === product_id &&
            String(i.size) === sizeStr,
        );
        if (exists) {
          const t = this.items.find(
            (i) =>
              !isTempId(i.id) &&
              i.product_id === product_id &&
              String(i.size) === sizeStr,
          );
          if (t) {
            this.updateQty(t.id, t.quantity + 1);
            return;
          }
        }
      }
      this.items = this.items.filter(
        (i) =>
          !(
            isTempId(i.id) &&
            i.product_id === product_id &&
            !i.size &&
            !this.committingTempMap[i.id]
          ),
      );
      this.saveCache();
      try {
        await api.post("/carts", { product_id, size: sizeStr, quantity: 1 });
        await this.fetch();
      } catch (e) {
        await this.fetch();
        throw e;
      }
    },

    updateSize(cartId, newSize) {
      /* sama seperti sebelumnya */
      if (isTempId(cartId)) return;
      const idx = this.items.findIndex((i) => i.id === cartId);
      if (idx === -1) return;
      const oldSize = this.items[idx].size;
      const newSizeStr = String(newSize);
      this.items[idx].size = newSizeStr;
      this.pendingSize[cartId] = newSizeStr;
      this.updatingSizeMap[cartId] = true;
      this.saveCache();
      if (this.sizeQueue[cartId]) {
        clearTimeout(this.sizeQueue[cartId].timeoutId);
        this.sizeQueue[cartId].controller?.abort();
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(async () => {
        try {
          await api.put(
            `/carts/${cartId}`,
            { size: this.pendingSize[cartId] },
            { signal: controller.signal },
          );
          const { data } = await api.get("/carts");
          const temps = this.items.filter((i) => isTempId(i.id));
          this.items = [...(data.carts || []), ...temps];
          this.total = data.total_price;
          this.count = data.count;
        } catch (e) {
          const c =
            e.name === "CanceledError" ||
            e.code === "ERR_CANCELED" ||
            e.name === "AbortError";
          if (!c) this.items[idx].size = oldSize;
        } finally {
          delete this.sizeQueue[cartId];
          delete this.pendingSize[cartId];
          delete this.updatingSizeMap[cartId];
          this.saveCache();
        }
      }, 200);
      this.sizeQueue[cartId] = { timeoutId, controller };
    },

    updateQty(cartId, newQty) {
      if (isTempId(cartId)) return;
      if (newQty < 1) return;
      const idx = this.items.findIndex((i) => i.id === cartId);
      if (idx === -1) return;
      const maxStock = this.getStockForItem(this.items[idx]);
      if (newQty > maxStock) newQty = maxStock;
      const oldQty = this.items[idx].quantity;
      const oldCount = this.count;
      const oldTotal = this.total;
      this.items[idx].quantity = newQty;
      this.count += newQty - oldQty;
      this.total +=
        (newQty - oldQty) * Number(this.items[idx].product?.price || 0);
      this.pendingQty[cartId] = newQty;
      this.saveCache();
      if (this.qtyQueue[cartId]) {
        clearTimeout(this.qtyQueue[cartId].timeoutId);
        this.qtyQueue[cartId].controller?.abort();
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(async () => {
        try {
          await api.put(
            `/carts/${cartId}`,
            { quantity: this.pendingQty[cartId] },
            { signal: controller.signal },
          );
          const { data } = await api.get("/carts");
          this.total = data.total_price;
          this.count = data.count;
        } catch (e) {
          const c =
            e.name === "CanceledError" ||
            e.code === "ERR_CANCELED" ||
            e.name === "AbortError";
          if (c) return;
          this.items[idx].quantity = oldQty;
          this.count = oldCount;
          this.total = oldTotal;
          await this.fetch();
        } finally {
          delete this.qtyQueue[cartId];
          delete this.pendingQty[cartId];
          this.saveCache();
        }
      }, 300);
      this.qtyQueue[cartId] = {
        timeoutId,
        controller,
        oldQty,
        oldTotal,
        oldCount,
      };
    },

    async remove(id) {
      if (isTempId(id)) {
        this.items = this.items.filter((i) => i.id !== id);
        delete this.committingTempMap[id];
        this.saveCache();
        return;
      }
      const oldItems = [...this.items];
      const oldTotal = this.total;
      const oldCount = this.count;
      this.items = this.items.filter((i) => i.id !== id);
      this.count = this.items
        .filter((i) => !isTempId(i.id))
        .reduce((a, b) => a + b.quantity, 0);
      this.total = this.items
        .filter((i) => !isTempId(i.id))
        .reduce((a, b) => a + Number(b.product?.price || 0) * b.quantity, 0);
      this.saveCache();
      try {
        await api.delete(`/carts/${id}`);
        const { data } = await api.get("/carts");
        this.total = data.total_price;
        this.count = data.count;
      } catch {
        this.items = oldItems;
        this.total = oldTotal;
        this.count = oldCount;
        await this.fetch();
      }
    },

    duplicateWithNewSize(item) {
      if (
        this.items.some(
          (i) => isTempId(i.id) && i.product_id === item.product_id && !i.size,
        )
      )
        return;
      if (this.isQtyUpdating(item.id) || this.isSizeUpdating(item.id)) return;
      this.items.push({
        id: genTempId(),
        product_id: item.product_id,
        product: item.product,
        size: "",
        quantity: 1,
        product_variant_id: null,
      });
      this.saveCache();
    },

    async commitTempWithSize(tempId, size) {
      const idx = this.items.findIndex((i) => i.id === tempId);
      if (idx === -1) return;

      this.items[idx].size = String(size);
      this.committingTempMap[tempId] = true;
      this.saveCache();
      try {
        await api.post("/carts", {
          product_id: this.items[idx].product_id,
          size: String(size),
          quantity: 1,
        });
        await this.fetch();
        delete this.committingTempMap[tempId];
      } catch (e) {
        this.items[idx].size = "";
        delete this.committingTempMap[tempId];
        this.saveCache();
        throw e;
      }
    },
  },
});
