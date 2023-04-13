import db from "../models/index";
import bcrypt from "bcryptjs";
import emailService from './emailService';
const salt = bcrypt.genSaltSync(10);
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (email, token) => {
  let result = `${process.env.REACT_URL}/verify-account?email=${email}&token=${token}`;
  return result;
}

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["id", "email", "roleId", "password", "name"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = bcrypt.compareSync(password, user.password);

          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your Email doesn't exist in your system. Please try another email!`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check email is exist???
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage:
            "Your email is already in use, please try another email !!!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        let token = uuidv4();

        await emailService.sendSimpleEmail({
          reciverEmail: data.email,
          redirectLink: buildUrlEmail(data.email, token)
        })
        let reqregister = await db.UsersRegister.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            password: hashPasswordFromBcrypt,
            token: token,
          }
        });
        if (!reqregister[1]) {
          let updateregister = await db.UsersRegister.findOne({
            where: {
              email: reqregister[0].email
            },
            raw: false
          });
          if (updateregister) {
            updateregister.password = hashPasswordFromBcrypt;
            updateregister.token = token;
            await updateregister.save();
          }
        }

        resolve({
          errCode: 0,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let postVerifyAccount = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.token) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        let userRegister = await db.UsersRegister.findOne({
          where: {
            email: data.email,
            token: data.token,
          },
          raw: false
        })
        if (userRegister) {
          let completeregister = await db.User.findOrCreate({
            where: { email: data.email },
            defaults: {
              email: data.email,
              password: userRegister.password,
              roleId: 'R2',
            }
          });
          if (!completeregister[1]) {
            resolve({
              errCode: 1,
            })
          }
        }
        resolve({
          errCode: 0,
          errMessage: "Create new user succeed!"
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}
let handleGetUserById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId
          },
          attributes: ['email', 'name', 'address', 'phonenumber'],
        })

        if (!data) {
          data = {};
        }

        resolve({
          errCode: 0,
          errMessage: 'Ok',
          data
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: userId },
    });
    if (!user) {
      resolve({
        errCode: 2,
        errMessage: `The user isn't exists`,
      });
    }
    await db.User.destroy({
      where: { id: userId },
    });
    resolve({
      errCode: 0,
      message: "The user is deleted",
    });
  });
};

let handleEditUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing require parameters",
        });
      }

      let user = await db.User.findOne({
        where: { id: data.id, },
        raw: false,
      });

      if (user) {

        let checkpassword = await db.User.findOne({
          where: { id: data.id, },
          attributes: ['password'],
          raw: false,
        });

        let check = bcrypt.compareSync(data.password, checkpassword.password);

        if (check) {
          user.name = data.name;
          user.address = data.address;
          user.phonenumber = data.phonenumber;

          await user.save();
          resolve({
            errCode: 0,
            message: "Update the user succeeds!",
          });
        } else {
          resolve({
            errCode: -1,
            errMessage: `Wrong password!`,
          });
        }

      } else {
        resolve({
          errCode: 1,
          errMessage: `User's not found!`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  handleUserLogin: handleUserLogin,
  handleEditUser: handleEditUser,
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  getAllCodeService: getAllCodeService,
  postVerifyAccount: postVerifyAccount,
  handleGetUserById: handleGetUserById,
};
