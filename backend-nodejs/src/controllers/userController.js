import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  console.log(userData);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};
let handleGetUserById = async (req, res) => {
  try {
    let infor = await userService.handleGetUserById(req.query.id);
    return res.status(200).json(infor)
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}


let getAllUsers = async (req, res) => {
  try {
    let infor = await userService.getAllUsers();
    return res.status(200).json(
      infor
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};
let createNewUserByAdmin = async (req, res) => {
  console.log(req.body)
  let message = await userService.createNewUserByAdmin(req.body);
  return res.status(200).json(message);
};

let postVerifyAccount = async (req, res) => {
  try {
    let infor = await userService.postVerifyAccount(req.body);
    return res.status(200).json(
      infor
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

let handleDelelteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  try {
    let infor = await userService.handleEditUser(req.body);
    return res.status(200).json(
      infor
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
};
let editUserByAdmin = async (req, res) => {
  try {
    let infor = await userService.editUserByAdmin(req.body);
    return res.status(200).json(
      infor
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
};

let handleChangePassword = async (req, res) => {
  try {
    let infor = await userService.handleChangePassword(req.body);
    return res.status(200).json(
      infor
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

let forgotPassword = async (req, res) => {
  try {
    let infor = await userService.forgotPassword(req.body);
    return res.status(200).json(
      infor
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}
let postVerifyForgotPassword = async (req, res) => {
  try {
    let infor = await userService.postVerifyForgotPassword(req.body);
    return res.status(200).json(
      infor
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

module.exports = {
  handleLogin: handleLogin,
  getAllUsers: getAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDelelteUser: handleDelelteUser,
  postVerifyAccount: postVerifyAccount,
  handleGetUserById: handleGetUserById,
  handleChangePassword: handleChangePassword,
  editUserByAdmin: editUserByAdmin,
  createNewUserByAdmin: createNewUserByAdmin,
  forgotPassword: forgotPassword,
  postVerifyForgotPassword: postVerifyForgotPassword,
};
