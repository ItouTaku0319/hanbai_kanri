export const menuItems = [
  { label: "受注業務", path: "/orders", icon: "📦" },
  { label: "出荷業務", path: "/shipments", icon: "🚚" },
  {
    label: "マスタ",
    subMenu: [
      {
        label: "商品業務",
        subMenu: [{ label: "商品一覧", path: "/products", icon: "📋" }]
      },
      {
        label: "在庫業務",
        subMenu: [
          { label: "在庫検索", path: "/inventory", icon: "🔍" },
          { label: "在庫状況", path: "/inventory/status", icon: "📊" },
          { label: "入出庫履歴", path: "/inventory/log", icon: "📖" }
        ]
      },
      {
        label: "区分値マスタ",
        subMenu: [{ label: "区分値管理", path: "/master/codes", icon: "⚙️" }]
      }
    ]
  }
];
