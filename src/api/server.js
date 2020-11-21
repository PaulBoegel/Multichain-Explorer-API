"user-strict";

const fs = require("fs");
const FullnodeRestApi = require("./fullnodeRestAPI");
const ConfigurationHandler = require("../lib/handler/configurationHandler");
const TransactionRepository = require("../lib/repos/transactionRepository");

const configHandler = new ConfigurationHandler(fs);
const config = configHandler.readAndParseJsonFile("./explorer-config.json");
const transactionRepo = new TransactionRepository(config.dbConfig.test);
const fullnodeRestApi = new FullnodeRestApi(transactionRepo);

fullnodeRestApi.start();
