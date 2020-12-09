"user-strict";

const fs = require("fs");
const FullnodeApi = require("./fullnodeAPI");
const ConfigurationHandler = require("../lib/handler/configurationHandler");
const BlockRepository = require("../lib/repos/blockRepository");
const TransactionFormaterFactory = require("../lib/transactionFormaterFactory");
const TransactionFormaterManager = require("../lib/transactionFormaterManager");
const QueryBuilderFactory = require("../lib/queryBuilderFactory");
const QueryBuilderManager = require("../lib/queryBuilderManager");

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

const queryBuilderFactory = QueryBuilderFactory(
  formaterManager,
  blockRepo,
  config.blockchainConfig
);
const queryBuilderManager = QueryBuilderManager();

queryBuilderManager.setQueryBuilder(
  queryBuilderFactory.create(config.blockchainConfig.bitcoin.chainId)
);
queryBuilderManager.setQueryBuilder(
  queryBuilderFactory.create(config.blockchainConfig.litecoin.chainId)
);
queryBuilderManager.setQueryBuilder(
  queryBuilderFactory.create(config.blockchainConfig.dash.chainId)
);
queryBuilderManager.setQueryBuilder(
  queryBuilderFactory.create(config.blockchainConfig.ethereum.chainId)
);

const fullnodeApi = FullnodeApi(queryBuilderManager);

fullnodeApi.start();
