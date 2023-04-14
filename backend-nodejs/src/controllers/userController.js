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


let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users: [],
    });
  }

  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
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

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log("get all code error: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDelelteUser: handleDelelteUser,
  getAllCode: getAllCode,
  postVerifyAccount: postVerifyAccount,
  handleGetUserById: handleGetUserById,
  handleChangePassword: handleChangePassword,
};
