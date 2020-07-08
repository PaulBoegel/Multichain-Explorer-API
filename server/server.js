const express = require('express');
const fs = require('fs');

const app = express();
const FullnodeApiManager = require('./fullnodeAPIManager');
const FullnodeApiFactory = require('./fullnodeApiFactory');
const ConfigurationHandler = require('./handler/configurationHandler');
const TransactionHandler = require('./handler/transactionHandler');
const TransactionRepository = require('./repos/transactionRepository');

try {
  const configHandler = new ConfigurationHandler(fs);
  const config = configHandler.readAndParseJsonFile('./explorer-config.json');
  const transactionRepo = new TransactionRepository(config.dbConfig.test);
  const transactionHandler = new TransactionHandler(transactionRepo);
  const fullnodeApiFactory = new FullnodeApiFactory(config.blockchainConfig);
  const fullnodeApiManager = new FullnodeApiManager();

  fullnodeApiManager.setApi(fullnodeApiFactory.createApi("litecoin"));
  fullnodeApiManager.events.addListener('onNewTransaction', transactionHandler.saveTransaction);
  fullnodeApiManager.activateAllNotifyer();

} catch (err) {
  console.log(err);
}

module.exports = app;
