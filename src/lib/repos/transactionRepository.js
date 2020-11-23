"use strict";

const { MongoClient } = require("mongodb");

function TransactionRepository({ host, port, dbName, poolSize = 10 }) {
  const url = `mongodb://${host}:${port}`;
  let db = {};

  function connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        url,
        {
          useUnifiedTopology: true,
          poolSize,
        },
        function (err, client) {
          if (err) reject(err);
          db = client.db(dbName);
          resolve(true);
        }
      );
    });
  }

  function createIndex() {
    _checkConnection();
    db.collection("transactions").createIndex("txid");
    db.collection("transactions").createIndex("chainname");
    db.collection("transactions").createIndex("vin.txid");
    db.collection("transactions").createIndex("vout.addresses");
  }

  function _checkConnection() {
    if (Object.keys(db).length === 0)
      throw new Error("no database connection established");
  }

  async function get(query, projection = {}, limit) {
    try {
      _checkConnection();
      let transactions = db
        .collection("transactions")
        .find(query)
        .project(projection);

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
      _checkConnection();
      const transaction = await db
        .collection("transactions")
        .find({ txid, chainname })
        .project({ _id: 0 })
        .limit(1);

      const result = await transaction.toArray();
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async function add(newTransaction) {
    try {
      _checkConnection();
      const { txid, chainname, ...data } = newTransaction;
      const keys = { txid, chainname };
      data.timestamp = Date.now();
      return await db
        .collection("transactions")
        .updateOne(keys, { $set: { ...data } }, { upsert: true });
    } catch (err) {
      throw err;
    }
  }

  async function addMany(transactions) {
    _checkConnection();
    const result = await db
      .collection("transactions")
      .insertMany(transactions, { ordered: false });
    return result.insertedCount;
  }

  return { connect, createIndex, addMany, get, getByIds, add };
}

module.exports = TransactionRepository;
