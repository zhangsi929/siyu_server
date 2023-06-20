/*
 * @Author: Ethan Zhang
 * @Date: 2023-06-13 22:50:48
 * @LastEditTime: 2023-06-19 19:17:23
 * @FilePath: /siyu/newbackend/models/plugins/xunhu.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const axios = require("axios");
const crypto = require("crypto");

// 获取精确到秒的时间戳
function getSecondTimestamp(date) {
  if (date == null) {
    return 0;
  }
  let timestamp = String(date.getTime());
  let length = timestamp.length;
  if (length > 3) {
    return Number(timestamp.substring(0, length - 3));
  } else {
    return 0;
  }
}

const pay = async (trade_order_id, total_fee) => {
  // appid
  const appid = "201906125482"; // need to hide
  // appsecret
  const appsecret = "fdd71ac173dd532750533d4859449d4b"; // real secret key, need to hide
  // 请求路径
  const url = "https://api.diypc.com.cn/payment/do.html";
  // nonce_str  random int to string, 31 length
  const nonce_str = Math.random().toString(36).substr(2, 15);
  //
  const notify_url = "https://www.siyuhub.com/pay/callback"; //"https://eozlweyfo3w7zin.m.pipedream.net"

  // 设置 传递参数的集合，方便 传递数据。
  let options = {
    // ...
    // 这里是你的其他参数，例如：
    version: "1.1",
    appid: appid,
    trade_order_id: trade_order_id,
    total_fee: total_fee,
    title: "思渝AI-套餐支付",
    time: getSecondTimestamp(new Date()),
    notify_url: notify_url,
    nonce_str: nonce_str,
    // ...
  };

  try {
    // 获取按照 ASCII 字母顺序排序后的 options keys
    const sortedKeys = Object.keys(options).sort();

    // 构造待哈希的字符串
    let sb = "";
    for (let key of sortedKeys) {
      sb += key + "=" + options[key] + "&";
    }
    sb = sb.slice(0, -1); // remove the last '&'
    sb += appsecret; // append the secret key

    // 计算 MD5 哈希值
    const hash = crypto.createHash("md5").update(sb).digest("hex");

    // 添加哈希到 options
    options.hash = hash;

    console.log("Options: ", options); // Log the options object

    // 发送 POST 请求
    const response = await axios.post(url, options);
    console.log("Response: ", response.data);

    const map = response.data;
    if ("url" in map) {
      console.log("URL: ", map["url"]);
    }
    return response.data;
  } catch (error) {
    console.error("An error occurred: ", error);
    console.log("调 虎皮椒支付 时 出现了问题");
  }
};

module.exports = pay;
