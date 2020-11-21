"use strict";
const FullnodeServiceFactory = require("./lib/fullnodeServiceFactory");
const FullnodeNotifyerFactory = require("./lib/fullnodeNotifyerFactory");
const FullnodeSyncFactory = require("./lib/fullnodeSyncFactory");
const FullnodeServiceManager = require("./lib/fullnodeServiceManager");
const FullnodeNotifyerManager = require("./lib/fullnodeNotifyerManager.js");
const FullnodeSyncManager = require("./lib/fullnodeSyncManager");

const TransactionFormaterFactory = require("./lib/transactionFormaterFactory");
const TransactionFormaterManager = require("./lib/transactionFormaterManager");

const ConfigurationHandler = require("./lib/handler/configurationHandler");
const TransactionHandler = require("./lib/handler/transactionHandler");
const TransactionRepository = require("./lib/repos/transactionRepository");
const BlockRepository = require("./lib/repos/blockRepository");

const BlockLogger = require("./lib/logger/blockLogger");
const ErrorLogger = require("./lib/logger/errorLogger");
const blockLoggerConf = require("./conf/blockLoggerConf");
const errorLoggerConf = require("./conf/errorLoggerConf");
const fs = require("fs");

async function main() {
  try {
    const blockLogger = new BlockLogger(blockLoggerConf);
    const errorLogger = new ErrorLogger(errorLoggerConf);

    const configHandler = ConfigurationHandler(fs);
    const config = configHandler.readAndParseJsonFile("./explorer-config.json");
    const transactionRepo = TransactionRepository(config.dbConfig.test);
    const blockRepo = BlockRepository(config.dbConfig.test);

    await transactionRepo.connect();
    await blockRepo.connect();

    await transactionRepo.createIndex();
    await blockRepo.createIndex();

    const transactionFormaterFactory = TransactionFormaterFactory();
    const transactionFormaterManager = TransactionFormaterManager();

    transactionFormaterManager.setFormater(
      transactionFormaterFactory.create("bitcoin")
    );
    transactionFormaterManager.setFormater(
      transactionFormaterFactory.create("litecoin")
    );
    transactionFormaterManager.setFormater(
      transactionFormaterFactory.create("dash")
    );
    transactionFormaterManager.setFormater(
      transactionFormaterFactory.create("ethereum")
    );

    const transactionHandler = TransactionHandler(
      transactionRepo,
      blockRepo,
      transactionFormaterManager
    );

    const fullnodeServiceFactory = FullnodeServiceFactory(
      config.blockchainConfig
    );
    const fullnodeNotifyerFactory = FullnodeNotifyerFactory(
      config.blockchainConfig
    );

    const fullnodeServiceManager = FullnodeServiceManager();
    const fullnodeNotifyerManager = FullnodeNotifyerManager();

    fullnodeServiceManager.setService(fullnodeServiceFactory.create("bitcoin"));

    fullnodeServiceManager.setService(fullnodeServiceFactory.create("dash"));

    fullnodeServiceManager.setService(
      fullnodeServiceFactory.create("litecoin")
    );

    fullnodeServiceManager.setService(
      fullnodeServiceFactory.create("ethereum")
    );

    fullnodeNotifyerManager.setNotifyer(
      fullnodeNotifyerFactory.create("bitcoin")
    );

    fullnodeNotifyerManager.setNotifyer(fullnodeNotifyerFactory.create("dash"));

    fullnodeNotifyerManager.setNotifyer(
      fullnodeNotifyerFactory.create("litecoin")
    );

    const fullnodeSyncFactory = FullnodeSyncFactory({
      fullnodeServiceManager,
      transactionHandler,
      config: config.blockchainConfig,
    });

    const fullnodeSyncManager = FullnodeSyncManager(fullnodeNotifyerManager);

    fullnodeSyncManager.setSynchronizer(fullnodeSyncFactory.create("bitcoin"));
    fullnodeSyncManager.setSynchronizer(fullnodeSyncFactory.create("dash"));
    fullnodeSyncManager.setSynchronizer(fullnodeSyncFactory.create("litecoin"));
    fullnodeSyncManager.setSynchronizer(fullnodeSyncFactory.create("ethereum"));

    fullnodeNotifyerManager.events.addListener(
      "onNewBlock",
      async (blockhash, chainname) => {
        try {
          await transactionHandler.saveBlockDataWithHash({
            blockhash,
            service: fullnodeServiceManager.getService(chainname),
          });
        } catch (err) {
          ErrorLogger.error(
            `${err.message} - file: ${err.fileName} - line: ${err.lineNumber}`
          );
        }
      }
    );

    await fullnodeSyncManager.activateAllSynchronizer();
  } catch (err) {
    console.log(err);
    ErrorLogger.error(
      `${err.message} - file: ${err.fileName} - line: ${err.lineNumber}`
    );
  }
}

main();
