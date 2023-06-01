/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-29 14:59:12
 * @LastEditTime: 2023-05-31 21:22:23
 * @FilePath: /siyu/newbackend/models/Usage.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const User = require("./User");
module.exports = {
  async updateUserUsage(userId, { api, tokens }) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found.");
      }

      user.used_api += api;
      user.api_balance -= 1;
      user.used_tokens += tokens;

      await user.save();

      return {
        used_api: user.used_api,
        used_tokens: user.used_tokens,
      };
    } catch (err) {
      console.error(`Error updating user usage: ${err}`);
      throw new Error("Failed to update user usage.");
    }
  },
};
