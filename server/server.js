const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const litecoinFullnodeConnector = require('./node_notifyer/litecoinFullnodeNotifyer')

const app = express();

if (process.env.ENV === 'Test') {
    console.log('This is a test');
    const db = mongoose.connect('mongodb://localhost/blockchainDB_Test');
} else {
    console.log('This is productive');
    const db = mongoose.connect('mongodb://localhost/blockchainDB');
}

const config = JSON.parse(fs.readFileSync('./fullnode_config.json'));

litecoinFullnodeConnector(config.litecoin);

module.exports = app;
