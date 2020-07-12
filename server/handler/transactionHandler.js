"use strict";

function transactionHandler(transactionRepo) {

  async function saveTransaction(rawTransaction, relationDepth, service) {
    try {
      let transaction = await service.decodeTransaction(rawTransaction);
      const id = transaction.txid;

      if (await checkIfSaved(id) == false) {
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

  async function checkIfSaved(transactionId) {
    try {
      const result = await transactionRepo.getById(transactionId);
      if (result == null)
        return false;

      return true;
    } catch (err) {
      throw err;
    }
  }

  return { saveTransaction }

}

module.exports = transactionHandler;
