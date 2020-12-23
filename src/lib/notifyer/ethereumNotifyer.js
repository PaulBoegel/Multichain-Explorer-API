"use strict";
const Web3 = require("web3");
const EventEmitter = require("events");

function EthereumNotifyer(conf) {
  let web3;
  const events = new EventEmitter();
  const chainId = conf.chainId;

  function _logNotifyerStarted() {
    BlockLogger.info({
      message: "Notifyer started",
      data: { chainId: `${this.chainId}` },
    });
  }

  async function connectToSocket() {
    const url = `${conf.worker.url}:${conf.worker.port}`;
    const provider = new Web3.providers.WebsocketProvider(url);
    web3 = new Web3(provider);
  }

  async function closeConnection() {
    const success = await web3.eth.clearSubscriptions();
    return success;
  }

  async function subscribeToBlocks() {
    _logNotifyerStarted.call(this);
    web3.eth
      .subscribe("newBlockHeaders")
      .on("data", (blockHeader) => {
        events.emit("onNewBlock", blockHeader.hash, conf.chainId);
      })
      .on("error", (error) => {
        throw new Error(error);
      });
  }

  async function subscribeToTransactions() {}

  return {
    connectToSocket,
    closeConnection,
    subscribeToTransactions,
    subscribeToBlocks,
    chainId,
    events,
  };
}

module.exports = EthereumNotifyer;
