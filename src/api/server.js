"user-strict";

const fs = require("fs");
const FullnodeServiceManager = require("../lib/fullnodeServiceManager");
const FullnodeServiceFactory = require("../lib/fullnodeServiceFactory");
const FullnodeRestApi = require("./fullnodeRestAPI");
const ConfigurationHandler = require("../lib/handler/configurationHandler");
const TransactionHandler = require("../lib/handler/transactionHandler");
const TransactionRepository = require("../lib/repos/transactionRepository");
const BlockRepository = require("../lib/repos/blockRepository");

const configHandler = new ConfigurationHandler(fs);
const config = configHandler.readAndParseJsonFile("./explorer-config.json");
const transactionRepo = new TransactionRepository(config.dbConfig.test);
const blockRepo = new BlockRepository(config.dbConfig.test);
const transactionHandler = new TransactionHandler(transactionRepo, blockRepo);
const fullnodeServiceFactory = new FullnodeServiceFactory(
  config.blockchainConfig
);
const fullnodeServiceManager = new FullnodeServiceManager();

fullnodeServiceManager.setService(fullnodeServiceFactory.create("litecoin"));

fullnodeServiceManager.setService(fullnodeServiceFactory.create("bitcoin"));

const fullnodeRestApi = new FullnodeRestApi(
  transactionHandler,
  fullnodeServiceManager
);

fullnodeRestApi.start();
