const express = require('express');
const mongoose = require('mongoose');
const configHandler = require('../handler/configurationHandler');
const notificationManager = require('./notificationManager');

const app = express();

// if (process.env.ENV === 'Test') {
//     console.log('This is a test');
//     const db = mongoose.connect('mongodb://localhost/blockchainDB_Test');
// } else {
//     console.log('This is productive');
//     const db = mongoose.connect('mongodb://localhost/blockchainDB');
// }

const config = configHandler.getFullnodeConfiguration('./fullnode-config.json');

notificationManager(config);
notificationManager.activateLitecoinNotifyer();

module.exports = app;
