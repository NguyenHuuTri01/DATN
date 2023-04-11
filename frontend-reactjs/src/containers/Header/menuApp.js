export const adminMenu = [
  {//quản lý người dùng
    name: "menu.admin.manage-user",
    menus: [
      // {
      //   name: "menu.admin.crud",
      //   link: "/system/user-manage",
      // },
      {
        name: "menu.admin.crud-redux",
        link: "/system/create-new-user",
      },
      // {
      //   name: "menu.admin.manage-admin",
      //   link: "/system/user-admin",
      // },
      { //Đổi mật khẩu
        name: "menu.admin.change-password",
        link: "/system/change-password",
      },
    ],
  },
];

export const doctorMenu = [
  {
    name: "menu.admin.manage-user",
    menus: [

      {//quản lý kế hoạch khám bệnh của bác sĩ
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {//Chỉnh sửa thông tin
        name: "menu.doctor.manage-infomation",
        link: "/system/manage-doctor",
      },
      {//quản lý bệnh nhân khám bệnh của bác sĩ
        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      },
      { //Đổi mật khẩu
        name: "menu.admin.change-password",
        link: "/system/change-password",
      },
    ]
  }
];