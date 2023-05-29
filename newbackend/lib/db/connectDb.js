/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:07:51
 * @LastEditTime: 2023-05-26 20:16:20
 * @FilePath: /guangqi/newbackend/lib/db/connectDb.js
 * @Description:
 *
 * connetct to mongodb
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      // bufferMaxEntries: 0,
      // useFindAndModify: true,
      // useCreateIndex: true
    };

    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDb;
