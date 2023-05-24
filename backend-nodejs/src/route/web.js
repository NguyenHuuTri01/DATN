import express from "express";
import userController from "../controllers/userController";
import productController from "../controllers/productController";
import cartController from '../controllers/cartController';
import paypalController from '../controllers/paypalController';
import customerController from '../controllers/customerController';
import cashController from '../controllers/cashController';
import giaCongColtroller from '../controllers/giaCongController';
import detailController from '../controllers/detailController';
import messageController from '../controllers/messageController';
import paintPackController from '../controllers/paintPackController';
import paintDiscountController from '../controllers/paintDiscountController';

let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.post("/api/create-new-user-by-admin", userController.createNewUserByAdmin);
  router.post("/api/login", userController.handleLogin);
  router.put("/api/edit-user", userController.handleEditUser);
  router.put("/api/edit-user-by-admin", userController.editUserByAdmin);
  router.get("/api/get-user-by-id", userController.handleGetUserById);
  router.get("/api/get-all-users", userController.getAllUsers);
  router.delete("/api/delete-user", userController.handleDelelteUser);
  router.put("/api/change-password", userController.handleChangePassword);
  router.post('/api/verify-account', userController.postVerifyAccount);
  router.post("/api/forgot-password", userController.forgotPassword);
  router.post('/api/verify-forgot-password', userController.postVerifyForgotPassword);

  router.post("/api/create-loai-son", productController.createLoaiSon);
  router.get("/api/get-all-loai-son", productController.getAllLoaiSon);
  router.put("/api/edit-loai-son", productController.editLoaiSon);
  router.delete("/api/delete-loai-son", productController.delelteLoaiSon);

  router.post("/api/create-paint-product", productController.createPaintProduct);
  router.get("/api/get-all-paint-product", productController.getAllPaintProduct);
  router.put("/api/edit-paint-product", productController.editPaintProduct);
  router.delete("/api/delete-paint-product", productController.deleltePaintProduct);
  router.get("/api/get-all-select-product", productController.getDataSelectProduct);
  router.get("/api/get-top-paint-product", productController.getTopPaintProduct);

  router.post("/api/add-to-cart", cartController.addToCart);
  router.get("/api/get-cart-by-id", cartController.getAllCartById);
  router.put("/api/update-cart-item", cartController.updateCart);
  router.post("/api/delete-cart-item", cartController.delelteCart);
  router.put("/api/update-status-cart", cartController.updateStatusCart);

  router.post("/api/create-paypal", paypalController.createPaypal);
  router.put("/api/update-paypal", paypalController.updatePaypal);
  router.post("/api/delete-paypal", paypalController.deletePaypal);
  router.get("/api/get-history-paypal", paypalController.getHistoryPaypal);
  router.get("/api/get-all-order-paypal", paypalController.getAllOrderPaypal);
  router.post("/api/cancel-order-paypal", paypalController.cancelOrderPaypal);
  router.post("/api/transaction-paypal", paypalController.getOrderByTransaction);

  router.post("/api/save-infor-order", customerController.createOrder);
  router.get("/api/get-transaction-by-id", customerController.getTransactionById);
  router.get("/api/get-all-transaction", customerController.getAllTransaction);
  router.get("/api/get-all-cancel-order", customerController.getAllCancelOrder);
  router.put("/api/update-transport", customerController.updateTransport);
  router.get("/api/sum-number-item-bought", customerController.sumNumberItemBought);

  router.post("/api/create-cash-on-receipt", cashController.createCashOnReceipt);
  router.post('/api/verify-order', cashController.postVerifyOrder);
  router.get("/api/get-history-cash", cashController.getHistoryCash);
  router.get("/api/get-all-order-cash", cashController.getAllOrderCash);
  router.post("/api/cancel-order-cash", cashController.cancelOrderCash);
  router.post("/api/transaction-cash", cashController.getOrderByTransaction);

  router.post("/api/submit-gia-cong", giaCongColtroller.submitForm);
  router.get("/api/get-gia-cong", giaCongColtroller.getGiaCong);
  router.get("/api/get-gia-cong-by-id", giaCongColtroller.getGiaCongById);
  router.put("/api/nhan-gia-cong", giaCongColtroller.nhanGiaCong);
  router.post("/api/get-gia-cong-by-id", giaCongColtroller.nhanGiaCongById);
  router.put("/api/hoan-thanh", giaCongColtroller.hoanThanh);
  router.put("/api/cancel-gia-cong", giaCongColtroller.cancelGiaCong);

  router.post("/api/create-detail-paint", detailController.createInformationPaint);
  router.put("/api/update-detail-paint", detailController.updateInformationPaint);
  router.get("/api/get-detail-paint-by-id", detailController.getInformationById);

  router.post("/api/send-message", messageController.sendMessage);
  router.post("/api/get-message", messageController.getMessage);
  router.post("/api/get-all-message", messageController.getAllMessage);
  router.post("/api/seen-message", messageController.seenMessage);
  router.post("/api/get-not-seen-message", messageController.getNotSeenMessage);

  router.post("/api/create-paint-pack", paintPackController.createPaintPack);
  router.put("/api/update-paint-pack", paintPackController.updatePaintPack);
  router.get("/api/get-paint-pack-by-id", paintPackController.getPaintPackById);
  router.get("/api/get-all-paint-pack", paintPackController.getAllPaintPack);
  router.delete("/api/delete-paint-pack", paintPackController.deletePaintPack);

  router.post("/api/create-paint-discount", paintDiscountController.createPaintDiscount);
  router.get("/api/get-paint-discount-by-id", paintDiscountController.getPaintDiscountById);
  router.put("/api/update-paint-discount", paintDiscountController.updatePaintDiscount);
  router.delete("/api/delete-paint-discount", paintDiscountController.deletePaintDiscount);
  router.get("/api/get-all-paint-discount-by-product", paintDiscountController.getAllPaintDiscount);

  return app.use("/", router);
};

module.exports = initWebRoutes;
