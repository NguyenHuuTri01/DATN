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

const createLoaiSon = (data) => {
  return axios.post('/api/create-loai-son', data)
}
const getAllLoaiSon = () => {
  return axios.get(`/api/get-all-loai-son`);
};
const editLoaiSon = (data) => {
  return axios.put("/api/edit-loai-son", data);
};
const delelteLoaiSon = (paintId) => {
  return axios.delete("/api/delete-loai-son", {
    data: {
      paintId: paintId,
    },
  });
};

const createPaintProduct = (data) => {
  return axios.post('/api/create-paint-product', data)
}
const getAllPaintProduct = () => {
  return axios.get(`/api/get-all-paint-product`);
};
const editPaintProduct = (data) => {
  return axios.put("/api/edit-paint-product", data);
};
const deleltePaintProduct = (paintId) => {
  return axios.delete("/api/delete-paint-product", {
    data: {
      id: paintId,
    },
  });
};

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
  getUserById,
  createLoaiSon,
  getAllLoaiSon,
  editLoaiSon,
  delelteLoaiSon,
  createPaintProduct,
  getAllPaintProduct,
  editPaintProduct,
  deleltePaintProduct,
};
