import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("api/login", { email, password });
};
const getUserById = (id) => {
  return axios.get(`/api/get-user-by-id?id=${id}`)
}
const getAllUsers = () => {
  return axios.get(`/api/get-all-users`);
};
const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data);
};
const createNewUserByAdmin = (data) => {
  return axios.post("/api/create-new-user-by-admin", data);
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
const editUserByAdmin = (inputData) => {
  return axios.put("/api/edit-user-by-admin", inputData);
};

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

const addToCart = (data) => {
  return axios.post('/api/add-to-cart', data)
}
const getAllCartById = (userId) => {
  return axios.get(`/api/get-cart-by-id/?userId=${userId}`);
};
const updateCart = (data) => {
  return axios.put("/api/update-cart-item", data);
};
const delelteCart = (data) => {
  return axios.post("/api/delete-cart-item", data);
};
const updateStatusCart = (data) => {
  return axios.put("/api/update-status-cart", data);
};

const createPaypal = (data) => {
  return axios.post('/api/create-paypal', data)
}
const updatePaypal = (data) => {
  return axios.put("/api/update-paypal", data);
};
const deletePaypal = (data) => {
  return axios.post("/api/delete-paypal", data);
};

const saveInforOrder = (data) => {
  return axios.post('/api/save-infor-order', data)
}

const createCashOnReceipt = (data) => {
  return axios.post('/api/create-cash-on-receipt', data)
}
const postVerifyOrder = (data) => {
  return axios.post('/api/verify-order', data)
}

const getHistoryPaypal = (userId) => {
  return axios.get(`/api/get-history-paypal/?userId=${userId}`);
};
const getHistoryCash = (userId) => {
  return axios.get(`/api/get-history-cash/?userId=${userId}`);
};

const getTransactionById = (userId) => {
  return axios.get(`/api/get-transaction-by-id/?userId=${userId}`);
};

const cancelOrderPaypal = (transactionId) => {
  return axios.post('/api/cancel-order-paypal', transactionId)
}
const cancelOrderCash = (transactionId) => {
  return axios.post('/api/cancel-order-cash', transactionId)
}
const getAllTransaction = () => {
  return axios.get(`/api/get-all-transaction`);
};
const getAllCancelOrder = () => {
  return axios.get(`/api/get-all-cancel-order`);
};
const getAllOrderCash = () => {
  return axios.get(`/api/get-all-order-cash`);
};
const getOrderByTransactionCash = (transactionId) => {
  return axios.post('/api/transaction-cash', transactionId)
}
const getOrderByTransactionPaypal = (transactionId) => {
  return axios.post('/api/transaction-paypal', transactionId)
}
const updateTransport = (data) => {
  return axios.put("/api/update-transport", data);
};

const submitForm = (data) => {
  return axios.post('/api/submit-gia-cong', data)
}
const getGiaCong = () => {
  return axios.get('/api/get-gia-cong')
}
const getGiaCongById = (userId) => {
  return axios.get(`/api/get-gia-cong-by-id/?userId=${userId}`);
};
const nhanGiaCong = (data) => {
  return axios.put("/api/nhan-gia-cong", data);
};
const nhanGiaCongById = (data) => {
  return axios.post('/api/get-gia-cong-by-id', data)
}
const hoanThanh = (data) => {
  return axios.put("/api/hoan-thanh", data);
};
const cancelGiaCong = (data) => {
  return axios.put("/api/cancel-gia-cong", data);
};

const getDataSelectProduct = () => {
  return axios.get('/api/get-all-select-product')
}


const createInformationPaint = (data) => {
  return axios.post('/api/create-detail-paint', data)
}
const updateInformationPaint = (data) => {
  return axios.put("/api/update-detail-paint", data);
};

const getInformationById = (paintId) => {
  return axios.get(`/api/get-detail-paint-by-id/?paintId=${paintId}`)
}
const sumNumberItemBought = () => {
  return axios.get(`/api/sum-number-item-bought`)
}
const getTopPaintProduct = () => {
  return axios.get(`/api/get-top-paint-product`);
};
const postVerifyForgotPassword = (data) => {
  return axios.post('/api/verify-forgot-password', data)
}

const sendMessage = (data) => {
  return axios.post('/api/send-message', data)
}
const getMessage = (data) => {
  return axios.post('/api/get-message', data)
}
const getAllMessage = (data) => {
  return axios.post('/api/get-all-message', data)
}
const seenMessage = (data) => {
  return axios.post('/api/seen-message', data)
}
const getNotSeenMessage = (data) => {
  return axios.post('/api/get-not-seen-message', data)
}


const createPaintPack = (data) => {
  return axios.post('/api/create-paint-pack', data)
}
const updatePaintPack = (data) => {
  return axios.put("/api/update-paint-pack", data);
};

const getPaintPackById = (id) => {
  return axios.get(`/api/get-paint-pack-by-id?id=${id}`)
}
const getAllPaintPack = () => {
  return axios.get(`/api/get-all-paint-pack`);
};
const deletePaintPack = (id) => {
  return axios.delete("/api/delete-paint-pack", {
    data: {
      id: id,
    },
  });
};

const createPaintDiscount = (data) => {
  return axios.post('/api/create-paint-discount', data)
}
const getAllPaintDiscount = (paintId) => {
  return axios.get(`/api/get-all-paint-discount-by-product?paintId=${paintId}`)
}
const updatePaintDiscount = (data) => {
  return axios.put("/api/update-paint-discount", data);
};
const deletePaintDiscount = (id) => {
  return axios.delete("/api/delete-paint-discount", {
    data: {
      id: id,
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
  addToCart,
  getAllCartById,
  delelteCart,
  updateCart,
  updateStatusCart,
  createPaypal,
  updatePaypal,
  deletePaypal,
  saveInforOrder,
  createCashOnReceipt,
  postVerifyOrder,
  getHistoryPaypal,
  getHistoryCash,
  getTransactionById,
  createNewUserByAdmin,
  editUserByAdmin,
  cancelOrderPaypal,
  cancelOrderCash,
  getAllOrderCash,
  getAllTransaction,
  getOrderByTransactionCash,
  getOrderByTransactionPaypal,
  updateTransport,
  submitForm,
  getGiaCong,
  nhanGiaCong,
  nhanGiaCongById,
  hoanThanh,
  getDataSelectProduct,
  createInformationPaint,
  updateInformationPaint,
  getInformationById,
  getAllCancelOrder,
  sumNumberItemBought,
  getTopPaintProduct,
  postVerifyForgotPassword,
  sendMessage,
  getMessage,
  getAllMessage,
  seenMessage,
  getNotSeenMessage,
  createPaintPack,
  updatePaintPack,
  getPaintPackById,
  getAllPaintPack,
  getGiaCongById,
  cancelGiaCong,
  deletePaintPack,
  createPaintDiscount,
  getAllPaintDiscount,
  updatePaintDiscount,
  deletePaintDiscount,
};
