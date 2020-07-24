"use strict";

function transactionHandler(transactionRepo) {

  async function saveTransaction(inTransaction, inputDepth, service, verbose) {
    try {
      let transaction = verbose ? inTransaction : await service.decodeTransaction(inTransaction);
      const chainname = service.chainname;
      const id = transaction.txid;

      if (await checkIfSaved(id, chainname) == false) {
        transaction.chainname = chainname;
        await transactionRepo.add(transaction);
        await service.handleTransactionInputs(transaction, inputDepth);
        console.log(`Added ${id} to database.`);
      }

    } catch (err) {
      throw err;
    }
  }

  async function saveManyTransactions(inputs, inputDepth, service){

    for(let i=0; i> inputs.length; i++){
      const exists = await checkIfSaved(input[i].txid, service.chainname);
      if(exists){
        inputs.splice(i, 1);
      }
    }

    await transactionRepo.addMany(inputs);

    inputs.forEach(async (input) => {
      await service.handleTransactionInputs(input, inputDepth);
      console.log(`Added ${input.txid} to database`);
    });

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
      return result ? true : false;
    } catch (err) {
      throw err;
    }
  }

  return { getTransaction, saveTransaction, saveManyTransactions }

}

module.exports = transactionHandler;
