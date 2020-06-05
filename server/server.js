const express = require('express');
//const mongoose = require('mongoose');
const app = express();
const NotificationManager = require('./notificationManager')
const ConfigurationHandler = require('./handler/configurationHandler');

// if (process.env.ENV === 'Test') {
//     console.log('This is a test');
//     const db = mongoose.connect('mongodb://localhost/blockchainDB_Test');
// } else {
//     console.log('This is productive');
//     const db = mongoose.connect('mongodb://localhost/blockchainDB');
// }

const configHandler = new ConfigurationHandler();
const config = configHandler.getFullnodeConfiguration('./fullnode-config.json');
const notificationManager = new NotificationManager(config);

notificationManager.activateAllNotifyer();

module.exports = app;
