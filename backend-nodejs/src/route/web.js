import express from "express";
import userController from "../controllers/userController";
import productController from "../controllers/productController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.post("/api/login", userController.handleLogin);
  router.put("/api/edit-user", userController.handleEditUser);
  router.get("/api/get-user-by-id", userController.handleGetUserById);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.delete("/api/delete-user", userController.handleDelelteUser);
  router.put("/api/change-password", userController.handleChangePassword);
  router.post('/api/verify-account', userController.postVerifyAccount);

  router.post("/api/create-loai-son", productController.createLoaiSon);
  router.get("/api/get-all-loai-son", productController.getAllLoaiSon);
  router.delete("/api/delete-loai-son", productController.delelteLoaiSon);

  router.get("/api/allcode", userController.getAllCode);
  return app.use("/", router);
};

module.exports = initWebRoutes;
