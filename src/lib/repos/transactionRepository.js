"use strict";

const { MongoClient } = require('mongodb');

function TransactionRepository(dbConfig) {

  if (typeof dbConfig === undefined || dbConfig == null)
    throw new ReferenceError('No dbConfig param defined.');

  const url = `mongodb://${dbConfig.host}:${dbConfig.port}`;
  const dbName = dbConfig.dbName;
  let db;

  MongoClient.connect(url, {
    poolSize: dbConfig.poolSize
  }, function (err, client) {
    if(err) throw err;
    db = client.db(dbName);
  })

  async function get(query, limit){
    try {

      let transactions = db.collection('transactions').find(query);

      if(limit > 0 ){
        transactions = transactions.limit(limit);
      }

      transactions = await transactions.toArray();

      return transactions;

    } catch(err){
      throw err;
    }
  }

  async function getById(id, chainname) {
    try {
      const transaction = await db.collection('transactions').find({txid: id, chainname: chainname}).limit(1);

      return await transaction.toArray()[0];

    } catch(err){
      throw err;
    }
  }

  async function add(newTransaction){
    try {
      newTransaction.timestamp = Date.now();
      await db.collection('transactions').insertOne(newTransaction);

    } catch(err){
      throw err;
    }
  }

  async function addMany(transactions) {
    try {
      transactions.forEach((transaction) => transaction.timestamp = Date.now());
      await db.collection('transactions').insertMany(transactions);

    } catch(err){
      throw err;
    }
  }

  return { addMany, get, getById, add }
}

module.exports = TransactionRepository;
