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

    const transactionFormaterFactory = TransactionFormaterFactory(
      config.blockchainConfig
    );
    const transactionFormaterManager = TransactionFormaterManager();

    transactionFormaterManager.setFormater(
      transactionFormaterFactory.create(config.blockchainConfig.bitcoin.chainId)
    );
    transactionFormaterManager.setFormater(
      transactionFormaterFactory.create(
        config.blockchainConfig.litecoin.chainId
      )
    );
    transactionFormaterManager.setFormater(
      transactionFormaterFactory.create(config.blockchainConfig.dash.chainId)
    );
    transactionFormaterManager.setFormater(
      transactionFormaterFactory.create(
        config.blockchainConfig.ethereum.chainId
      )
    );

    const transactionHandler = TransactionHandler(blockRepo);

    const fullnodeServiceFactory = FullnodeServiceFactory(
      config.blockchainConfig
    );
    const fullnodeNotifyerFactory = FullnodeNotifyerFactory(
      config.blockchainConfig
    );

    const fullnodeServiceManager = FullnodeServiceManager();
    const fullnodeNotifyerManager = FullnodeNotifyerManager();

    fullnodeServiceManager.setService(
      fullnodeServiceFactory.create(config.blockchainConfig.bitcoin.chainId)
    );

    fullnodeServiceManager.setService(
      fullnodeServiceFactory.create(config.blockchainConfig.dash.chainId)
    );

    fullnodeServiceManager.setService(
      fullnodeServiceFactory.create(config.blockchainConfig.litecoin.chainId)
    );

    fullnodeServiceManager.setService(
      fullnodeServiceFactory.create(config.blockchainConfig.ethereum.chainId)
    );

    fullnodeNotifyerManager.setNotifyer(
      fullnodeNotifyerFactory.create(config.blockchainConfig.bitcoin.chainId)
    );

    fullnodeNotifyerManager.setNotifyer(
      fullnodeNotifyerFactory.create(config.blockchainConfig.dash.chainId)
    );

    fullnodeNotifyerManager.setNotifyer(
      fullnodeNotifyerFactory.create(config.blockchainConfig.litecoin.chainId)
    );

    fullnodeNotifyerManager.setNotifyer(
      fullnodeNotifyerFactory.create(config.blockchainConfig.ethereum.chainId)
    );

    const fullnodeSyncFactory = FullnodeSyncFactory({
      fullnodeServiceManager,
      transactionFormaterManager,
      transactionHandler,
      config: config.blockchainConfig,
    });

    const fullnodeSyncManager = FullnodeSyncManager(fullnodeNotifyerManager);

    fullnodeSyncManager.setSynchronizer(
      fullnodeSyncFactory.create(config.blockchainConfig.bitcoin.chainId)
    );
    fullnodeSyncManager.setSynchronizer(
      fullnodeSyncFactory.create(config.blockchainConfig.dash.chainId)
    );
    fullnodeSyncManager.setSynchronizer(
      fullnodeSyncFactory.create(config.blockchainConfig.litecoin.chainId)
    );
    fullnodeSyncManager.setSynchronizer(
      fullnodeSyncFactory.create(config.blockchainConfig.ethereum.chainId)
    );

    fullnodeNotifyerManager.events.addListener(
      "onNewBlock",
      async (blockhash, chainId) => {
        try {
          await transactionHandler.saveBlockDataWithHash({
            blockhash,
            service: fullnodeServiceManager.getService(chainId),
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
