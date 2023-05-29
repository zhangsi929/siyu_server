/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:32
 * @LastEditTime: 2023-05-27 20:59:54
 * @FilePath: /guangqi/newbackend/models/schema/presetSchema.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const mongoose = require("mongoose");
const conversationPreset = require("./conversationPreset");
const presetSchema = mongoose.Schema(
  {
    presetId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "新对话",
      meiliIndex: true,
    },
    user: {
      type: String,
      default: null,
    },
    // google only
    examples: [{ type: mongoose.Schema.Types.Mixed }],
    ...conversationPreset,
  },
  { timestamps: true }
);

const Preset = mongoose.models.Preset || mongoose.model("Preset", presetSchema);

module.exports = Preset;
