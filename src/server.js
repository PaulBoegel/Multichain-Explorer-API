"use strict";
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

const LogHandler = require("./lib/handler/logHandler");
const logOptions = require("./winston");
const fs = require("fs");

async function main() {
  try {
    const logger = new LogHandler(logOptions);
    const configHandler = ConfigurationHandler(fs);
    const config = configHandler.readAndParseJsonFile("./explorer-config.json");
    const transactionRepo = TransactionRepository(config.dbConfig.test);
    const blockRepo = BlockRepository(config.dbConfig.test);

    await transactionRepo.connect();
    await blockRepo.connect();

    await transactionRepo.createIndex();
    await blockRepo.createIndex();

    const transactionHandler = TransactionHandler(transactionRepo, blockRepo);

    const fullnodeServiceFactory = FullnodeServiceFactory(
      config.blockchainConfig
    );
    const fullnodeNotifyerFactory = FullnodeNotifyerFactory(
      config.blockchainConfig
    );

    const fullnodeServiceManager = FullnodeServiceManager();
    const fullnodeNotifyerManager = FullnodeNotifyerManager();

    fullnodeServiceManager.setService(
      fullnodeServiceFactory.create("litecoin")
    );
    fullnodeNotifyerManager.setNotifyer(
      fullnodeNotifyerFactory.create("litecoin")
    );

    fullnodeServiceManager.setService(fullnodeServiceFactory.create("bitcoin"));
    fullnodeNotifyerManager.setNotifyer(
      fullnodeNotifyerFactory.create("bitcoin")
    );

    fullnodeServiceManager.setService(fullnodeServiceFactory.create("dash"));
    fullnodeNotifyerManager.setNotifyer(fullnodeNotifyerFactory.create("dash"));

    const fullnodeSyncFactory = FullnodeSyncFactory({
      fullnodeServiceManager,
      transactionHandler,
      config: config.blockchainConfig,
    });

    const fullnodeSyncManager = FullnodeSyncManager(fullnodeNotifyerManager);

    fullnodeSyncManager.setSynchronizer(fullnodeSyncFactory.create("litecoin"));
    fullnodeSyncManager.setSynchronizer(fullnodeSyncFactory.create("bitcoin"));
    fullnodeSyncManager.setSynchronizer(fullnodeSyncFactory.create("dash"));

    fullnodeNotifyerManager.events.addListener(
      "onNewBlock",
      (blockhash, chainname) => {
        transactionHandler
          .saveBlockDataWithHash({
            blockhash,
            service: fullnodeServiceManager.getService(chainname),
          })
          .then();
      }
    );

    fullnodeServiceManager.activateAllListeners();
    fullnodeSyncManager.activateAllSynchronizer();
  } catch (err) {
    console.log(err);
  }
}

main();
