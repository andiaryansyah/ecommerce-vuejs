export const menuItems = [
  {
    icon: "grommet-icons:overview",
    label: "Overview",
    visible: ["admin"],
    href: "/admin",
    subItems: [],
  },
  {
    icon: "carbon:product",
    label: "Products",
    visible: ["admin"],
    subItems: [
      { label: "Product List", href: "/admin/products" },
      { label: "Categories", href: "/admin/products/categories" },
    ],
  },
  {
    icon: "carbon:user-multiple",
    label: "Customers",
    visible: ["admin"],
    href: "/admin/customers",
    subItems: [],
  },
  {
    icon: "carbon:order-server",
    label: "Orders",
    visible: ["admin"],
    href: "/admin/orders",
    subItems: [],
  },
  {
    icon: "codicon:account",
    label: "My Account",
    visible: ["user"],
    subItems: [
      { label: "Profile", href: "/user/account/profile" },
      { label: "Change Password", href: "/user/account/password" },
    ],
  },
  {
    icon: "bx:purchase-tag",
    label: "My Shopping",
    visible: ["user"],
    subItems: [
      { label: "Purchase", href: "/user/shopping/purchases" },
      { label: "Vouchers", href: "/user/shopping/vouchers" },
      { label: "Whislist", href: "/user/shopping/wishlist" },
    ],
  },
  {
    icon: "basil:notification-on-outline",
    label: "Notifications",
    visible: ["user"],
    subItems: [
      {
        icon: "/home.png",
        label: "Order Updates",
        href: "/user/notifications/orders",
      },
      {
        icon: "/home.png",
        label: "Promotions",
        href: "/user/notifications/promotions",
      },
    ],
  },
  {
    icon: "arcticons:settings",
    label: "Settings",
    visible: ["admin", "user"],
    href: "/settings",
    subItems: [],
  },
];
