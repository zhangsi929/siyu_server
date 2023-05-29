/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-28 22:58:11
 * @LastEditTime: 2023-05-28 22:59:38
 * @FilePath: /guangqi/newbackend/playground-3.mongodb.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use("test");

db.users.updateMany(
  {},
  {
    $set: {
      token_balance: 0,
      used_token: 0,
      api_balance: 0,
      used_api: 0,
      membership_level: "basic",
    },
  }
);

// // Run a find command to view items sold on April 4th, 2014.
// const salesOnApril4th = db
//   .getCollection("sales")
//   .find({
//     date: { $gte: new Date("2014-04-04"), $lt: new Date("2014-04-05") },
//   })
//   .count();

// // Print a message to the output window.
// console.log(`${salesOnApril4th} sales occurred in 2014.`);
