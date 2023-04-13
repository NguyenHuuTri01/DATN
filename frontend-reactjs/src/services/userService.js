import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("api/login", { email, password });
};
const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};
const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data);
};

const changePassword = (data) => {
  return axios.put("/api/change-password", data);
};

const deleteUserService = (userId) => {
  return axios.delete("/api/delete-user", {
    data: {
      id: userId,
    },
  });
};
const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};

const getUserById = (id) => {
  return axios.get(`/api/get-user-by-id?id=${id}`)
}

const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const postVerifyAccount = (data) => {
  return axios.post('/api/verify-account', data)
}

const postSendRemedy = (data) => {
  return axios.post('/api/send-remedy', data)
}
export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  changePassword,
  deleteUserService,
  editUserService,
  getAllCodeService,
  postVerifyAccount,
  postSendRemedy,
  getUserById
};
