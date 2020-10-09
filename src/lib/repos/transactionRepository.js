"use strict";

const { MongoClient } = require("mongodb");

function TransactionRepository(dbConfig) {
  if (typeof dbConfig === undefined || dbConfig == null)
    throw new ReferenceError("No dbConfig param defined.");

  const url = `mongodb://${dbConfig.host}:${dbConfig.port}`;
  const dbName = dbConfig.dbName;
  let db;

  function connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        url,
        {
          useUnifiedTopology: true,
          poolSize: dbConfig.poolSize,
        },
        function (err, client) {
          if (err) reject(err);
          db = client.db(dbName);
          resolve(true);
        }
      );
    });
  }

  async function get(query, limit) {
    try {
      let transactions = db.collection("transactions").find(query);

      if (limit > 0) {
        transactions = transactions.limit(limit);
      }

      transactions = await transactions.toArray();

      return transactions;
    } catch (err) {
      throw err;
    }
  }

  async function getByIds(txid, chainname) {
    try {
      const transaction = await db
        .collection("transactions")
        .find({ txid, chainname })
        .limit(1);

      const result = await transaction.toArray();
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async function add(newTransaction) {
    try {
      const { txid, chainname, ...data } = newTransaction;
      const keys = { txid, chainname };
      data.timestamp = Date.now();
      await db
        .collection("transactions")
        .updateOne(keys, { $set: { ...data } }, { upsert: true });
    } catch (err) {
      throw err;
    }
  }

  async function addMany(transactions) {
    try {
      transactions.forEach(
        (transaction) => (transaction.timestamp = Date.now())
      );
      await db.collection("transactions").insertMany(transactions);
    } catch (err) {
      throw err;
    }
  }

  return { connect, addMany, get, getByIds, add };
}

module.exports = TransactionRepository;
