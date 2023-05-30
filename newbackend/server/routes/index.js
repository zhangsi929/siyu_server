/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:38
 * @LastEditTime: 2023-05-29 16:57:52
 * @FilePath: /siyu/newbackend/server/routes/index.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const ask = require("./ask");
const messages = require("./messages");
const convos = require("./convos");
const presets = require("./presets");
const prompts = require("./prompts");
const search = require("./search");
const tokenizer = require("./tokenizer");
const auth = require("./auth");
const oauth = require("./oauth");
const { router: endpoints } = require("./endpoints");
const user = require("./user");

module.exports = {
  search,
  ask,
  messages,
  convos,
  presets,
  prompts,
  auth,
  oauth,
  tokenizer,
  endpoints,
  user,
};
