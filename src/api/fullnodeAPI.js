"use strict";

const express = require("express");
const graphServer = require("./graphql");
const cors = require("cors");
const TransactionRouter = require("./routes/transactionRouter");
const TransactionController = require("./controllers/transactionController");

function FullnodeApi(queryBuilderManager) {
  const app = express();
  const port = process.env.PORT || 3000;

  function start() {
    graphServer({ queryBuilderManager }).applyMiddleware({ app });
    app.use(cors({ origin: true }));
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

module.exports = FullnodeApi;
