import express from "express";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.post("/api/login", userController.handleLogin);
  router.put("/api/edit-user", userController.handleEditUser);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.delete("/api/delete-user", userController.handleDelelteUser);

  router.post('/api/verify-account', userController.postVerifyAccount);

  router.get("/api/allcode", userController.getAllCode);
  return app.use("/", router);
};

module.exports = initWebRoutes;
