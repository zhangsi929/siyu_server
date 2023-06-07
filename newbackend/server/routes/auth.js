/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:38
 * @LastEditTime: 2023-06-05 21:57:28
 * @FilePath: /siyu/newbackend/server/routes/auth.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const express = require("express");
const {
  resetPasswordRequestController,
  resetPasswordController,
  getUserController,
  loginController,
  logoutController,
  refreshController,
  registrationController,
  sendEmailCodeController,
} = require("../controllers/auth.controller");
const requireJwtAuth = require("../../middleware/requireJwtAuth");
const requireLocalAuth = require("../../middleware/requireLocalAuth");

const router = express.Router();

//Local
router.get("/user", requireJwtAuth, getUserController);
router.post("/logout", requireJwtAuth, logoutController);
router.post("/login", requireLocalAuth, loginController);
router.post("/refresh", requireJwtAuth, refreshController);
router.post("/register", registrationController);
router.post("/requestPasswordReset", resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);
router.post("/sendEmailCode", sendEmailCodeController);

module.exports = router;
