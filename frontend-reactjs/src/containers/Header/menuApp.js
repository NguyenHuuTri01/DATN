export const adminMenu = [
  {//quản lý người dùng
    name: "menu.admin.manage-user",
    menus: [
      {
        name: "menu.admin.manage-user",
        link: "/system/manage-user",
      },
    ],
  },
];

export const employeeMenu = [
  {
    name: "menu.admin.manage-paint",
    menus: [
      {
        name: "menu.employee.danh-muc-hang",
        link: "/system/danh-muc-hang",
      },
      {
        name: "menu.employee.manage-paint",
        link: "/system/manage-paint",
      },
      {
        name: "menu.employee.manage-discount",
        link: "/system/manage-paint-discount",
      },
      {
        name: "menu.employee.imformation-paint",
        link: "/system/information-paint",
      },
      {
        name: "menu.employee.paint-pack",
        link: "/system/paint-pack",
      },
    ]
  },
  {
    name: "menu.admin.statistical",
    menus: [
      {
        name: "menu.employee.list-order",
        link: "/system/list-order",
      },
      {
        name: "menu.employee.cancel-order",
        link: "/system/list-cancel-order",
      },
      {
        name: "menu.employee.number-of-item-sold",
        link: "/system/number-of-item-sold",
      },
      {
        name: "menu.employee.customer-buy-a-lot",
        link: "/system/customer-buy-a-lot",
      },
    ]
  }
];