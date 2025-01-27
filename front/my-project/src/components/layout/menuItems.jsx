export const menuItems = [
  { label: "受注業務", path: "/orders", icon: "📦" },
  { label: "出荷業務", path: "/shipments", icon: "🚚" },
  {
    label: "マスタ",
    subMenu: [
      {
        label: "商品業務",
        subMenu: [{ label: "商品一覧", path: "/syohinList", icon: "📋" }]
      },
      {
        label: "在庫業務",
        subMenu: [
          { label: "在庫検索", path: "/zaikoList", icon: "🔍" },
          { label: "在庫状況", path: "/zaiko/status", icon: "📊" },
          { label: "入出庫履歴", path: "/zaiko/log", icon: "📖" }
        ]
      },
      {
        label: "区分値マスタ",
        subMenu: [{ label: "区分値管理", path: "/master/codes", icon: "⚙️" }]
      }
    ]
  }
];
