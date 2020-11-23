"use strict";

const express = require("express");
const cors = require("cors");
const TransactionRouter = require("./routes/transactionRouter");
const TransactionController = require("./controllers/transactionController");

function FullnodeRestApi(queryBuilderManager) {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());

  function start() {
    initAPI();
    app.listen(port, () => {
      console.log(`Fullnode REST API runnning on port ${port}`);
    });
  }

  async function initAPI() {
    const transactionController = new TransactionController(
      queryBuilderManager
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
