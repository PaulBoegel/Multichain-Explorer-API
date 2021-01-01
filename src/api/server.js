"user-strict";

const fs = require("fs");
const FullnodeApi = require("./fullnodeAPI");
const ConfigurationHandler = require("../lib/handler/configurationHandler");
const BlockRepository = require("../lib/repos/blockRepository");
const TransactionFormaterFactory = require("../lib/transactionFormaterFactory");
const TransactionFormaterManager = require("../lib/transactionFormaterManager");
const ControllerFactory = require("../lib/controllerFactory");
const ControllerManager = require("../lib/controllerManager");

const configHandler = new ConfigurationHandler(fs);
const config = configHandler.readAndParseJsonFile("./explorer-config.json");
const blockRepo = new BlockRepository(config.dbConfig.test);

const formaterFactory = TransactionFormaterFactory(config.blockchainConfig);
const formaterManager = TransactionFormaterManager();

formaterManager.setFormater(
  formaterFactory.create(config.blockchainConfig.bitcoin.chainId)
);
formaterManager.setFormater(
  formaterFactory.create(config.blockchainConfig.litecoin.chainId)
);
formaterManager.setFormater(
  formaterFactory.create(config.blockchainConfig.dash.chainId)
);
formaterManager.setFormater(
  formaterFactory.create(config.blockchainConfig.ethereum.chainId)
);

const controllerFactory = ControllerFactory(
  formaterManager,
  blockRepo,
  config.blockchainConfig
);
const controllerManager = ControllerManager();

controllerManager.setController(
  controllerFactory.create(config.blockchainConfig.bitcoin.chainId)
);
controllerManager.setController(
  controllerFactory.create(config.blockchainConfig.litecoin.chainId)
);
controllerManager.setController(
  controllerFactory.create(config.blockchainConfig.dash.chainId)
);
controllerManager.setController(
  controllerFactory.create(config.blockchainConfig.ethereum.chainId)
);

const fullnodeApi = FullnodeApi(controllerManager);

fullnodeApi.start();
