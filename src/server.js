"use strict";

const fs = require("fs");

const FullnodeServiceFactory = require("./lib/fullnodeServiceFactory");
const FullnodeNotifyerFactory = require("./lib/fullnodeNotifyerFactory");
const FullnodeSyncFactory = require("./lib/fullnodeSyncFactory");
const FullnodeServiceManager = require("./lib/fullnodeServiceManager");
const FullnodeNotifyerManager = require("./lib/fullnodeNotifyerManager.js");
const FullnodeSyncManager = require("./lib/fullnodeSyncManager");

const ConfigurationHandler = require("./lib/handler/configurationHandler");
const TransactionHandler = require("./lib/handler/transactionHandler");
const TransactionRepository = require("./lib/repos/transactionRepository");
const BlockRepository = require("./lib/repos/blockRepository");

const configHandler = new ConfigurationHandler(fs);
const config = configHandler.readAndParseJsonFile("./explorer-config.json");
const transactionRepo = new TransactionRepository(config.dbConfig.test);
const blockRepo = new BlockRepository(config.dbConfig.test);
const transactionHandler = new TransactionHandler(transactionRepo, blockRepo);

const fullnodeServiceFactory = new FullnodeServiceFactory(
  config.blockchainConfig
);
const fullnodeNotifyerFactory = new FullnodeNotifyerFactory(
  config.blockchainConfig
);

const fullnodeServiceManager = new FullnodeServiceManager();
const fullnodeNotifyerManager = new FullnodeNotifyerManager();

fullnodeServiceManager.setService(fullnodeServiceFactory.create("litecoin"));
fullnodeNotifyerManager.setNotifyer(fullnodeNotifyerFactory.create("litecoin"));

fullnodeServiceManager.setService(fullnodeServiceFactory.create("bitcoin"));
fullnodeNotifyerManager.setNotifyer(fullnodeNotifyerFactory.create("bitcoin"));

const fullnodeSyncFactory = new FullnodeSyncFactory({
  fullnodeServiceManager,
  transactionRepo,
  blockRepo,
});

const fullnodeSyncManager = new FullnodeSyncManager(fullnodeNotifyerManager);

fullnodeSyncManager.setSynchronizer(fullnodeSyncFactory.create("litecoin"));

fullnodeNotifyerManager.events.addListener(
  "onNewBlock",
  (blockHash, chainname) => {
    transactionHandler
      .saveBlockTransactions(
        blockHash,
        fullnodeServiceManager.getService(chainname)
      )
      .then();
  }
);

fullnodeServiceManager.activateAllListeners();
fullnodeSyncManager.activateAllSynchronizer();
