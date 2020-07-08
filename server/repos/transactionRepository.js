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

  async function getById(id) {
    try {
      const transaction = await db.collection('transactions').findOne({txid: id});

      return transaction;

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

  async function loadData(data) {
    if (typeof data === undefined || data == null)
      throw new ReferenceError('No data object param defined.');

    try {
      const result = await db.collection('transactions').insertMany(data);

      return result;

    } catch(err){
      throw err;
    }
  }

  return { loadData, get, getById, add }
}

module.exports = TransactionRepository;
