export const adminMenu = [
  {//quản lý người dùng
    name: "menu.admin.manage-paint",
    menus: [
      {
        name: "menu.admin.crud-redux",
        link: "/system/create-new-user",
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
    ]
  },
  {
    name: "menu.admin.statistical",
    menus: [
      {
        name: "menu.employee.statistical",
        link: "/system/statistical",
      },
    ]
  }
];