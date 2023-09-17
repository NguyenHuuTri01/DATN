import db from "../models/index";
import bcrypt from "bcryptjs";
import emailService from './emailService';
const salt = bcrypt.genSaltSync(10);
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (email, token) => {
  let result = `${process.env.REACT_URL}/verify-account?email=${email}&token=${token}`;
  return result;
}

let urlForgotPassword = (email, token) => {
  let result = `${process.env.REACT_URL}/forgot-password?email=${email}&token=${token}`;
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
            userData.errMessage = "Sai mật khẩu";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Email của bạn không tồn tại trong hệ thống, vui lòng thử 1 email khác!`;
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
let getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });
      if (!users) {
        users = {};
      }
      resolve({
        errCode: 0,
        errMessage: 'Ok',
        users
      })
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
            "Email của bạn đã được sử dụng, vui lòng thử một email khác !!!",
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
let editUserByAdmin = (data) => {
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
        user.name = data.name;
        user.address = data.address;
        user.phonenumber = data.phonenumber;
        user.roleId = data.roleId
        await user.save();
        resolve({
          errCode: 0,
          message: "Update the user succeeds!",
        });
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
let createNewUserByAdmin = (data) => {
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
        let res = await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          name: data.name,
          address: data.address,
          roleId: data.roleId,
          phonenumber: data.phonenumber,
        });
        console.log(res)
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
let handleChangePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.password || !data.newPassword || !data.confirmPassword) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let res = await db.User.findOne({
          where: {
            id: data.userId
          },
          raw: false
        })

        if (res) {
          let check = bcrypt.compareSync(data.password, res.password);
          if (check) {
            if (data.newPassword === data.confirmPassword) {
              let hashNewPassword = await hashUserPassword(data.newPassword);
              res.password = hashNewPassword;
              await res.save();
              resolve({
                errCode: 0,
                errMessage: 'Change password success'
              })
            } else {
              resolve({
                errCode: -2,
                errMessage: 'Confirm password failed'
              })
            }
          } else {
            resolve({
              errCode: -1,
              errMessage: 'Wrong password'
            })
          }
        } else {
          resolve({
            errCode: 1,
            errMessage: `User's not found!`,
          })
        }
      }
    } catch (e) {
      reject(e);
    }
  })
}

let forgotPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let res = await db.User.findOne({
          where: {
            email: data.email
          },
          raw: false
        })
        if (res) {
          let token = uuidv4();
          let reqforgot = await db.ForgotPassword.findOrCreate({
            where: { email: data.email, status: 'forgot' },
            defaults: {
              email: data.email,
              token: token,
              status: 'forgot',
            }
          });
          await emailService.sendForgotPassword({
            reciverEmail: data.email,
            redirectLink: urlForgotPassword(data.email, token)
          })
          if (!reqforgot[1]) {
            let update = await db.ForgotPassword.findOne({
              where: {
                email: reqforgot[0].email,
                status: 'forgot'
              },
              raw: false
            });
            if (update) {
              update.token = token;
              await update.save();
            }
          }
          resolve({
            errCode: 0,
            errMessage: `Ok`,
          })
        } else {
          resolve({
            errCode: 1,
            errMessage: `User's not found!`,
          })
        }
      }
    } catch (e) {
      reject(e);
    }
  })
}
let postVerifyForgotPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.token) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        let forgot = await db.ForgotPassword.findOne({
          where: {
            email: data.email,
            token: data.token,
            status: 'forgot'
          },
          raw: false
        })
        if (forgot) {
          // chuổi password 6 kí tự ngẫu nhiên
          const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
          let randomString = '';
          for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            randomString += chars[randomIndex];
          }
          // chuổi password 6 kí tự ngẫu nhiên
          let hashPassword = await hashUserPassword(randomString);
          let completeforgot = await db.User.findOne({
            where: {
              email: data.email,
            },
            raw: false
          });
          if (completeforgot) {
            completeforgot.password = hashPassword
            await completeforgot.save();

            forgot.status = 'complete';
            await forgot.save();

            await emailService.sendNewPassword({
              newPassword: randomString,
              reciverEmail: data.email
            })
            resolve({
              errCode: 0,
              errMessage: "Succeed!"
            })
          }
        } else {
          resolve({
            errCode: -1,
            errMessage: "Expired!"
          })
        }
      }
    } catch (e) {
      reject(e);
    }
  })
}


module.exports = {
  createNewUser: createNewUser,
  handleUserLogin: handleUserLogin,
  handleEditUser: handleEditUser,
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  postVerifyAccount: postVerifyAccount,
  handleGetUserById: handleGetUserById,
  handleChangePassword: handleChangePassword,
  editUserByAdmin: editUserByAdmin,
  createNewUserByAdmin: createNewUserByAdmin,
  forgotPassword: forgotPassword,
  postVerifyForgotPassword: postVerifyForgotPassword,
};
