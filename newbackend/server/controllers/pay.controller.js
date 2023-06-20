/*
 * @Author: Ethan Zhang
 * @Date: 2023-06-10 16:18:27
 * @LastEditTime: 2023-06-19 19:14:22
 * @FilePath: /siyu/newbackend/server/controllers/pay.controller.js
 * @Description:
 *
 * 从xunhupay获取支付链接
 * const billing = await Billing.findById(billingId).populate('userId');
console.log(billing.userId); // 这将会是一个 User 文档，而不仅仅是一个 ObjectId
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const nodemailer = require("nodemailer");
const UserVerification = require("../../models/schema/userVerificationSchema");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Billing = require("../../models/schema/billingSchema");
const pay = require("../../models/plugins/xunhu");

const isProduction = process.env.NODE_ENV === "production";

// this is a POST request that will call xunhu pay api to get the payment url
const createXunhunUrlController = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const total_fee = req.body.total_fee;
  const plan = req.body.plan;
  const paymentMethod = req.body.paymentMethod;

  const billing = new Billing({
    userId: user._id,
    userEmail: user.email,
    totalFee: total_fee, // The total fee for the billing
    status: "pending", // The status of the billing
    plan: plan, // The plan for which the user is billed
    transactionId: "", // The ID of the transaction once it is completed
    paymentMethod: paymentMethod, // The method through which the payment was made
    currency: "RMB", // The currency in which the payment was made
    billingAddress: "", // The billing address of the user
    billingCreateTs: Date.now(), // The timestamp at which the billing was created
  });
  // Now that the billing document is saved, we have the _id and can set it as the orderId
  // 这里为什么要await, 因为billing.save()是一个异步操作，如果不await，那么下面的代码就会在billing.save()之前执行，这样就会导致billing._id为空
  await billing.save();
  const uniqueOrderId = billing._id.toString();

  try {
    // Call the Xunhu API..., uniqueOrderId is the orderId, total_fee is the total fee
    const response = await pay(uniqueOrderId, total_fee);

    // Check if the 'url' field exists in the response
    if (!response || !response.url) {
      throw new Error("Failed to get the payment URL from the Xunhu API");
    }

    // Send the payment URL back to the client
    return res.json({ url: response.url });
  } catch (error) {
    // If the API call fails, delete the billing document
    await Billing.findByIdAndDelete(billing._id);

    // Then, return an error response, print specific error message
    console.error(error);
    return res.status(500).json({ error: "Failed to create Xunhu order" });
  }
};

// 这是一个POST请求，用于接收xunhupay的回调
const callBackController = async (req, res) => {
  console.log("Displaying all callback results:");

  for (const [key, value] of Object.entries(req.body)) {
    console.log(`${key}: ${value}`);
  }

  console.log("Displaying all callback results finished.");

  try {
    const billing = await Billing.findById(req.body.trade_order_id);

    if (!billing) {
      console.log(`No Billing found with the id: ${req.body.trade_order_id}`);
      return res.status(404).send("No Billing found");
    }

    if (req.body.status === "OD") {
      billing.transactionId = req.body.transaction_id;
      billing.status = "completed";
      billing.billingFinishTs = Date.now();
      await billing.save();

      console.log("User payment was successful.");
    } else {
      console.log("User payment was unsuccessful.");
    }
  } catch (error) {
    console.log("There was an uncaught error: ", error);
  }

  // Send a response to acknowledge the callback
  res.status(200).send("ok");
};

// Remember to export the callBackController
module.exports = {
  createXunhunUrlController,
  callBackController,
};
