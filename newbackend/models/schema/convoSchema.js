/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:32
 * @LastEditTime: 2023-05-28 21:58:58
 * @FilePath: /guangqi/newbackend/models/schema/convoSchema.js
 * @Description:
 *
 * 这个文件定义了一个名为 "convoSchema" 的 MongoDB 数据模型。模型定义了一个会话（"Conversation"）在数据库中的结构，并用于创建和操作数据库中的会话数据。
 * 此外，如果环境变量中存在 MEILI_HOST 和 MEILI_MASTER_KEY，那么这个模型会使用 mongoMeili 插件，用于将数据索引到 MeiliSearch，一个开源的搜索引擎。
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const mongoose = require("mongoose");
const mongoMeili = require("../plugins/mongoMeili");
const conversationPreset = require("./conversationPreset");
const convoSchema = mongoose.Schema(
  {
    conversationId: {
      type: String,
      unique: true,
      required: true,
      index: true,
      meiliIndex: true,
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
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    // google only
    examples: [{ type: mongoose.Schema.Types.Mixed }],
    ...conversationPreset,
    // for bingAI only
    jailbreakConversationId: {
      type: String,
      default: null,
    },
    conversationSignature: {
      type: String,
      default: null,
    },
    clientId: {
      type: String,
      default: null,
    },
    invocationId: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

if (process.env.MEILI_HOST && process.env.MEILI_MASTER_KEY) {
  convoSchema.plugin(mongoMeili, {
    host: process.env.MEILI_HOST,
    apiKey: process.env.MEILI_MASTER_KEY,
    indexName: "convos", // Will get created automatically if it doesn't exist already
    primaryKey: "conversationId",
  });
}

const Conversation =
  mongoose.models.Conversation || mongoose.model("Conversation", convoSchema);

module.exports = Conversation;
