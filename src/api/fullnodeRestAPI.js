"use strict";

const express = require("express");
const cors = require("cors");
const TransactionRouter = require("./routes/transactionRouter");
const TransactionController = require("./controllers/transactionController");

function FullnodeRestApi(transactionHandler, fullnodeServiceManager) {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());

  function start() {
    initAPI();
    app.listen(port, () => {
      console.log(`Fullnode REST API runnning on port ${port}`);
    });
  }

  function initAPI() {
    const transactionController = new TransactionController(
      transactionHandler,
      fullnodeServiceManager
    );
    const transactionRouter = new TransactionRouter(
      express.Router(),
      transactionController
    );

    app.use("/api", transactionRouter);
  }

  return { start };
}

module.exports = FullnodeRestApi;
