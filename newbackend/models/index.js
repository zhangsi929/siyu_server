/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:32
 * @LastEditTime: 2023-05-29 15:41:41
 * @FilePath: /siyu/newbackend/models/index.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const {
  getMessages,
  saveMessage,
  deleteMessagesSince,
  deleteMessages,
} = require("./Message");
const { getConvoTitle, getConvo, saveConvo } = require("./Conversation");
const {
  getPreset,
  getPresets,
  savePreset,
  deletePresets,
} = require("./Preset");
const { updateUserUsage } = require("./Usage");

module.exports = {
  getMessages,
  saveMessage,
  deleteMessagesSince,
  deleteMessages,

  getConvoTitle,
  getConvo,
  saveConvo,

  getPreset,
  getPresets,
  savePreset,
  deletePresets,

  updateUserUsage,
};
