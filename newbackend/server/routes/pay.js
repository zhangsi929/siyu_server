/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:38
 * @LastEditTime: 2023-06-19 17:56:00
 * @FilePath: /siyu/newbackend/server/routes/pay.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const express = require("express");
const {
  createXunhunUrlController,
  callBackController,
} = require("../controllers/pay.controller");
const requireJwtAuth = require("../../middleware/requireJwtAuth");
const router = express.Router();

//Local
router.post("/create", requireJwtAuth, createXunhunUrlController);
router.post("/callback", callBackController);

module.exports = router;
