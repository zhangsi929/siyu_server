/*
 * @Author: Ethan Zhang
 * @Date: 2023-06-19 18:08:53
 * @LastEditTime: 2023-06-19 18:15:53
 * @FilePath: /siyu/newbackend/models/schema/billingSchema.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */

// const billing = await Billing.findById(billingId).populate('userId');
// console.log(billing.userId); // 这将会是一个 User 文档，而不仅仅是一个 ObjectId
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User", // 注意这里应该是 "User" 而不是 "user"，这应该匹配你定义的 User 模型的名称
  },
  userEmail: {
    type: String,
    required: true,
  },
  totalFee: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed"], // You can specify the possible values
  },
  plan: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  billingAddress: {
    type: String,
  },
  billingCreateTs: {
    type: Date,
    required: true,
    default: Date.now,
  },
  billingFinishTs: {
    type: Date,
  },
});

module.exports = mongoose.model("Billing", billingSchema);
