"user-strict";

const fs = require("fs");
const FullnodeRestApi = require("./fullnodeRestAPI");
const ConfigurationHandler = require("../lib/handler/configurationHandler");
const TransactionRepository = require("../lib/repos/transactionRepository");
const TransactionFormaterFactory = require("../lib/transactionFormaterFactory");
const TransactionFormaterManager = require("../lib/transactionFormaterManager");

formaterFactory = TransactionFormaterFactory();
formaterManager = TransactionFormaterManager();

formaterManager.setFormater(formaterFactory.create("bitcoin"));
formaterManager.setFormater(formaterFactory.create("litecoin"));
formaterManager.setFormater(formaterFactory.create("dash"));
formaterManager.setFormater(formaterFactory.create("ethereum"));

const configHandler = new ConfigurationHandler(fs);
const config = configHandler.readAndParseJsonFile("./explorer-config.json");
const transactionRepo = new TransactionRepository(config.dbConfig.test);
const fullnodeRestApi = new FullnodeRestApi(transactionRepo, formaterManager);

fullnodeRestApi.start();
