"use strict";

const fs = require('fs');
const numeral = require('numeral');

const FullnodeApiManager = require('./fullnodeAPIManager');
const FullnodeApiFactory = require('./fullnodeApiFactory');
const FullnodeRestApi = require('./fullnodeRestAPI');
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
  const fullnodeRestApi = new FullnodeRestApi(transactionRepo);

  fullnodeApiManager.setApi(fullnodeApiFactory.createApi("litecoin"));
  fullnodeApiManager.events.addListener('onNewTransaction', transactionHandler.saveTransaction);
  fullnodeApiManager.activateAllAPIs();

  fullnodeRestApi.start();

  //check for memory leak
  //  setInterval(() => {
  //    const {rss, heapTotal} = process.memoryUsage();
  //    console.log('rss', numeral(rss).format('0.0 ib'),
  //                'heapTotal', numeral(heapTotal).format('0.0 ib'));
  //  }, 5000);

} catch (err) {
  console.log(err);
}


