export const user = {
  id: 99,
  role: "admin",
  name: "Admin Haven",
  email: "admin@havenkicks.com",
  password: 12345678,
  avatar: "../../public/account.png",
  dashboard: {
    stats: {
      totalUsers: 1200,
      totalOrders: 350,
      revenue: 50000000, // dalam rupiah
    },
    products: [
      { id: "P001", name: "Nike Flyknit Red", stock: 25 },
      { id: "P002", name: "Puma Smash White", stock: 40 },
    ],
    recentActivities: [
      { id: "ACT001", action: "Added new product", date: "2026-09-10" },
      { id: "ACT002", action: "Updated stock", date: "2026-09-12" },
    ],
  },
  id: 2,
  role: "user",
  name: "John Doe",
  email: "john@example.com",
  password: 12345678,
  avatar: "../../public/account.png",
  account: {
    profile: {
      username: "johndoe",
      phone: "+62 81234567890",
      address: "Jl. Merdeka No. 10, Makassar",
    },
    orders: [
      { id: "ORD001", product: "Nike Air Max", status: "Delivered" },
      { id: "ORD002", product: "Adidas Ultraboost", status: "Pending" },
    ],
  },
};
