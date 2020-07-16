"use strict";

function transactionHandler(transactionRepo) {

  async function saveTransaction(rawTransaction, relationDepth, service) {
    try {
      let transaction = await service.decodeTransaction(rawTransaction);
      const chainname = service.chainname;
      const id = transaction.txid;

      if (await checkIfSaved(id, chainname) == false) {
        transaction.chainname = chainname;
        await transactionRepo.add(transaction);
        await service.handleRelations(transaction, relationDepth);
        console.log(`Added ${id} to database.`);
      }

      transaction = null;
      rawTransaction = null;

    } catch (err) {
      throw err;
    }
  }

  async function getTransaction(txid, service) {
    try {
      let transaction = await transactionRepo.getById(txid, service.chainname);

      if (transaction)
          return transaction;


      transaction = await service.getTransaction(txid, true);

      if (transaction) {
        await transactionRepo.add(transaction);
        return transaction;
      }

      return null;

    } catch (err) {
      throw err;
    }

  }

  async function checkIfSaved(transactionId, chainname) {
    try {
      const result = await transactionRepo.getById(transactionId, chainname);
      if (result == null)
        return false;

      return true;
    } catch (err) {
      throw err;
    }
  }

  return { getTransaction, saveTransaction }

}

module.exports = transactionHandler;
