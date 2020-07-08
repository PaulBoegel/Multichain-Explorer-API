"use strict";

function transactionHandler(transactionRepo) {

  const startTime = Date.now();

  async function saveTransaction(rawTransaction, service) {
    try {
      const transaction = await service.decodeTransaction(rawTransaction);
      const id = transaction.txid;
      if (await checkIfSaved(id) == false) {
        await transactionRepo.add(transaction);
        console.log(`Added ${id} to database`);
      }

      const relations = await service.getRelations(transaction);

        if(relations)
           await saveRelations(relations, service);

    } catch (err) {
      throw err;
    }
  }

  async function saveRelations(relations, service) {
    const saveTasks = []
    for (let index = 0; index < relations.length; index++) {
      saveTasks.push(saveTransaction(relations[index], service));
    }
    await Promise.all(saveTasks).catch((err) => {
       console.log(err);
    });
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
