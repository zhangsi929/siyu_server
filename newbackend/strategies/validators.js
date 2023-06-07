/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:44
 * @LastEditTime: 2023-06-06 20:44:10
 * @FilePath: /siyu/newbackend/strategies/validators.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const Joi = require("joi");

const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(20).required(),
});

const registerSchema = Joi.object().keys({
  name: Joi.string().trim().min(2).max(30).required(),
  username: Joi.string()
    .trim()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(20).required(),
  confirm_password: Joi.string().trim().min(6).max(20).required(),
  code: Joi.string().required(), // Add your validation rule here.
});

module.exports = {
  loginSchema,
  registerSchema,
};
