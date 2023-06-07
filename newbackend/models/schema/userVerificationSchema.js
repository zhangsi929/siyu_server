/*
 * @Author: Ethan Zhang
 * @Date: 2023-06-05 17:49:32
 * @LastEditTime: 2023-06-05 18:51:20
 * @FilePath: /siyu/newbackend/models/schema/userVerificationSchema.js
 * @Description:File: /siyu/newbackend/models/schema/userVerificationSchema.js
 * This file defines the UserVerification model for the application's user registration process.
 * It includes two fields: email and code. The email field stores a unique,
 * lowercase email string, which is validated using validator.js.
 * The code field stores a four-character alphanumeric verification code.
 * Timestamps (createdAt and updatedAt) are automatically added.
 * The model is essential for email ownership verification during user registration or email address change.
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userVerificationSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "can't be blank"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "invalid email"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "can't be blank"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9]{4}$/.test(v); //This regular expression will only match strings that consist exactly of 4 alphanumeric characters.
        },
        message: (props) =>
          `${props.value} is not a valid verification code. It must be 4 length of digits or characters.`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserVerification", userVerificationSchema);
