"user-strict";
const EventEmitter = require("events");

function FullnodeNotifyerManager() {
  const events = new EventEmitter();
  const notifyerArray = [];

  function setNotifyer(notifyer) {
    notifyerArray.push(notifyer);
  }

  async function activateAllNotifyers() {
    if (notifyerArray.length == 0) throw "Notifyer array is empty.";
    const initPromiseArray = [];
    for (notifyer of notifyerArray) {
      initPromiseArray.push(initNotifyer(notifyer));
    }
    await Promise.all(initPromiseArray);
  }

  async function activateNotifyer(blockchainName) {
    if (notifyerArray.length == 0) throw "Notifyer array is empty.";

    const notifyer = notifyerArray.find(
      (item) => item.blockchain == blockchainName
    );
    await initNotifyer(notifyer);
  }

  async function initNotifyer(notifyer) {
    //notifyer.events.addListener("onNewTransaction", onNewTransaction);
    notifyer.events.addListener("onNewBlock", onNewBlock);
    await notifyer.connectToSocket();
    //await notifyer.subscribeToTransactions();
    await notifyer.subscribeToBlocks();
  }

  function onNewBlock(blockHash, chainname) {
    events.emit("onNewBlock", blockHash, chainname);
  }

  function onNewTransaction(transaction, inputDepth, chainname) {
    events.emit("onNewTransaction", transaction, inputDepth, chainname);
  }

  return { activateAllNotifyers, activateNotifyer, setNotifyer, events };
}

module.exports = FullnodeNotifyerManager;
