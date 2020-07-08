"use strict";

function transactionHandler(transactionRepo) {

  const startTime = Date.now();

  async function saveTransaction(transaction, service) {
    try {
      transaction = await service.decodeTransaction(transaction);

      if (await checkIfSaved(transaction.txid) == false) {
        await transactionRepo.add(transaction);
        console.log(`Added ${transaction.txid} to database`);
      }

      const relations = await service.getRelations(transaction);

       if(relations)
          await saveRelations(relations, service);

      transaction = null;

    } catch (err) {
      throw err;
    }
  }

  async function saveRelations(relations, service) {
    const saveTasks = []
    for (let index = 0; index < relations.length; index++) {
      saveTasks.push(saveTransaction(relations[index], service));
    }
    Promise.all(saveTasks).catch((err) => {
       console.log(err);
    });

    relations = null;
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
