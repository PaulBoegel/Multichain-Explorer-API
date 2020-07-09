"use strict";

function transactionHandler(transactionRepo) {

  const startTime = Date.now();

  async function saveTransaction(rawTransaction, service) {
    try {
      let transaction = await service.decodeTransaction(rawTransaction);
      const id = transaction.txid;

      if (await checkIfSaved(id) == false) {
        await transactionRepo.add(transaction);
        await service.handleRelations(transaction);
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
