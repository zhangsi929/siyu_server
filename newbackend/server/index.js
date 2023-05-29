/*
 * @Author: Ethan Zhang
 * @Date: 2023-05-23 21:08:38
 * @LastEditTime: 2023-05-27 00:24:52
 * @FilePath: /guangqi/newbackend/server/index.js
 * @Description:
 *
 * Copyright (c) 2023 Ethan Zhang, All Rights Reserved.
 */
const express = require("express");
const connectDb = require("../lib/db/connectDb");
const migrateDb = require("../lib/db/migrateDb");
const indexSync = require("../lib/db/indexSync");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");
const errorController = require("./controllers/error.controller");
const passport = require("passport");
const fs = require("fs");
const https = require("https");

const port = process.env.PORT || 3080;
const host = process.env.HOST || "localhost";
const projectPath = path.join(__dirname, "..", "..", "client");

(async () => {
  await connectDb();
  console.log("Connected to MongoDB");
  await migrateDb();
  await indexSync();

  const app = express();
  app.use(errorController);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(projectPath, "dist")));
  app.set("trust proxy", 1); // trust first proxy
  app.use(cors());

  // OAUTH
  app.use(passport.initialize());
  require("../strategies/jwtStrategy");
  require("../strategies/localStrategy");
  // if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  //   require('../strategies/googleStrategy');
  // }
  // if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  //   require('../strategies/facebookStrategy');
  // }
  app.use("/oauth", routes.oauth);
  // api endpoint
  app.use("/api/auth", routes.auth);
  app.use("/api/search", routes.search);
  app.use("/api/ask", routes.ask);
  app.use("/api/messages", routes.messages);
  app.use("/api/convos", routes.convos);
  app.use("/api/presets", routes.presets);
  app.use("/api/prompts", routes.prompts);
  app.use("/api/tokenizer", routes.tokenizer);
  app.use("/api/endpoints", routes.endpoints);

  // SSL Certificate files
  const privateKey = fs.readFileSync(
    path.join(__dirname, "ssl", "private.key"),
    "utf8"
  );
  const certificate = fs.readFileSync(
    path.join(__dirname, "ssl", "api_siyuhub_com.crt"),
    "utf8"
  );
  const ca = [
    fs.readFileSync(
      path.join(
        __dirname,
        "ssl",
        "Sectigo_RSA_Domain_Validation_Secure_Server_CA.crt"
      ),
      "utf8"
    ),
    fs.readFileSync(
      path.join(__dirname, "ssl", "USERTrust_RSA_Certification_Authority.crt"),
      "utf8"
    ),
  ];

  // HTTPS server options
  const options = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  // Start the HTTPS server
  https.createServer(options, app).listen(port, () => {
    console.log(`Server https listening on port ${port}`);
  });

  // app.listen(port, host, () => {
  //   if (host == "0.0.0.0")
  //     console.log(
  //       `Server listening on all interface at port ahahahah ${port}. Use http://localhost:${port} to access it`
  //     );
  //   else
  //     console.log(
  //       `Server listening at http://${
  //         host == "0.0.0.0" ? "localhost" : host
  //       }:${port}`
  //     );
  // });
})();

let messageCount = 0;
process.on("uncaughtException", (err) => {
  const errorMessage = err.message || "Unknown error";
  const stackTrace = err.stack || "No stack trace available";

  console.error(`There was an uncaught error: ${errorMessage}`);
  console.error(`Stack trace: ${stackTrace}`);

  if (errorMessage.includes("fetch failed")) {
    if (messageCount === 0) {
      console.error("Meilisearch error, search will be disabled");
      messageCount++;
    }
  } else if (errorMessage.includes("MongoDB")) {
    console.error("Database connection error");
  } else if (errorMessage.includes("SSL")) {
    console.error("SSL certificate error");
  } else {
    // Failing fast is often a good approach if we can't handle the specific error,
    // but be sure to implement proper recovery mechanism in your production environment.
    console.error("An unexpected error occurred, terminating process.");
    process.exit(1);
  }
});
