/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-29 16:33:23
 * @LastEditTime: 2023-05-31 21:19:55
 * @FilePath: /siyu/newbackend/server/routes/user.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const express = require("express");
const router = express.Router();
const requireJwtAuth = require("../../middleware/requireJwtAuth");
// User is a collection from mongodb
const User = require("../../models/User");

router.get("/stats", requireJwtAuth, async (req, res) => {
  try {
    // Assuming the user id is stored in req.user.id in the JWT payload
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the necessary fields
    res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token_balance: user.token_balance,
      used_token: user.used_token,
      api_balance: user.api_balance,
      used_api: user.used_api,
      membership_level: user.membership_level,
      user_level: user.user_level,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user data" });
  }
});

module.exports = router;
