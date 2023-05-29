/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:32
 * @LastEditTime: 2023-05-29 00:13:45
 * @FilePath: /guangqi/newbackend/models/User.js
 * @Description:
 *
 * jwt token 是在user这个file 里的一个 mehtod 里 生成的
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const DebugControl = require("../utils/debug.js");

function log({ title, parameters }) {
  DebugControl.log.functionName(title);
  DebugControl.log.parameters(parameters);
}

const Session = mongoose.Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9_]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "can't be blank"],
      lowercase: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      maxlength: 60,
    },
    avatar: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      required: true,
      default: "local",
    },
    role: {
      type: String,
      default: "USER",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: {
      type: [Session],
    },
    token_balance: {
      type: Number,
      default: 0,
    },
    used_token: {
      type: Number,
      default: 0,
    },
    api_balance: {
      type: Number,
      default: 0,
    },
    used_api: {
      type: Number,
      default: 0,
    },
    membership_level: {
      type: String,
      default: "basic", // 或者你想要的其他默认值
    },
  },
  { timestamps: true }
);

//Remove refreshToken from the response
userSchema.set("toJSON", {
  transform: function (_doc, ret) {
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.methods.toJSON = function () {
  return {
    id: this._id,
    provider: this.provider,
    email: this.email,
    name: this.name,
    username: this.username,
    avatar: this.avatar,
    role: this.role,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const isProduction = process.env.NODE_ENV === "production";
const secretOrKey = isProduction
  ? process.env.JWT_SECRET_PROD
  : process.env.JWT_SECRET_DEV;
const refreshSecret = isProduction
  ? process.env.REFRESH_TOKEN_SECRET_PROD
  : process.env.REFRESH_TOKEN_SECRET_DEV;

// 这里是一些可能的provider值：
// 'local': 用户使用邮箱（或用户名）和密码在你的应用中直接注册。
// 'google': 用户通过Google账户进行身份验证。
// 'facebook': 用户通过Facebook账户进行身份验证。
userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      username: this.username,
      provider: this.provider,
      email: this.email,
    },
    secretOrKey,
    { expiresIn: eval(process.env.SESSION_EXPIRY) }
  );
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      id: this._id,
      username: this.username,
      provider: this.provider,
      email: this.email,
    },
    refreshSecret,
    { expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY) }
  );
  return refreshToken;
};
// comparePassword 方法比较提供的密码和存储在数据库中的密码。
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

module.exports.hashPassword = async (password) => {
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });

  return hashedPassword;
};

module.exports.validateUser = (user) => {
  log({
    title: "Validate User",
    parameters: [{ name: "Validate User", value: user }],
  });
  const schema = {
    avatar: Joi.any(),
    name: Joi.string().min(2).max(80).required(),
    username: Joi.string()
      .min(2)
      .max(80)
      .regex(/^[a-zA-Z0-9_]+$/)
      .required(),
    password: Joi.string().min(8).max(60).allow("").allow(null),
  };

  return schema.validate(user);
};

module.exports = {
  async updateUserUsage(userId, { api, tokens }) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found.");
      }

      user.used_api += api;
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

const User = mongoose.model("User", userSchema);

module.exports = User;
