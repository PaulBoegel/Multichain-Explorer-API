"use strict";

const fs = require("fs");

const FullnodeServiceManager = require("./lib/fullnodeServiceManager");
const FullnodeServiceFactory = require("./lib/fullnodeServiceFactory");
const FullnodeNotifyerManager = require("./lib/fullnodeNotifyerManager.js");
const FullnodeNotifyerFactory = require("./lib/fullnodeNotifyerFactory");

const ConfigurationHandler = require("./lib/handler/configurationHandler");
const TransactionHandler = require("./lib/handler/transactionHandler");
const TransactionRepository = require("./lib/repos/transactionRepository");

const configHandler = new ConfigurationHandler(fs);
const config = configHandler.readAndParseJsonFile("./explorer-config.json");
const transactionRepo = new TransactionRepository(config.dbConfig.test);
const transactionHandler = new TransactionHandler(transactionRepo);

const fullnodeServiceFactory = new FullnodeServiceFactory(
  config.blockchainConfig
);
const fullnodeNotifyerFactory = new FullnodeNotifyerFactory(
  config.blockchainConfig
);

const fullnodeServiceManager = new FullnodeServiceManager();
const fullnodeNotifyerManager = new FullnodeNotifyerManager();

fullnodeServiceManager.setService(
  fullnodeServiceFactory.createService("litecoin")
);
fullnodeNotifyerManager.setNotifyer(
  fullnodeNotifyerFactory.createNotifyer("litecoin")
);

fullnodeServiceManager.setService(
  fullnodeServiceFactory.createService("bitcoin")
);
fullnodeNotifyerManager.setNotifyer(
  fullnodeNotifyerFactory.createNotifyer("bitcoin")
);

fullnodeNotifyerManager.events.addListener(
  "onNewTransaction",
  async (transaction, inputDepth, chainname) => {
    await transactionHandler.saveTransaction(
      transaction,
      inputDepth,
      fullnodeServiceManager.getService(chainname),
      false
    );
  }
);

fullnodeServiceManager.events.addListener(
  "onNewInputs",
  async (inputs, inputDepth, service) => {
    await transactionHandler.saveManyTransactions(inputs, inputDepth, service);
  }
);

fullnodeServiceManager.activateAllListeners();
// fullnodeNotifyerManager.activateAllNotifyers();
