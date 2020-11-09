const assert = require("assert");
const zmq = require("zeromq");
const LitecoinNotifyer = require("../../src/lib/notifyer/litecoinNotifyer");
const conf = require("../../explorer-config.json");

function getZmqConfig() {
  return {
    chainname: "litecoin",
    transactions: {
      notifyerRelationDepth: "1",
    },
    worker: {
      host: "127.0.0.1",
      port: "29000",
    },
  };
}

describe("LitecoinNotifyer subscribeToTransactions", () => {
  const sock = new zmq.Subscriber();
  const notifyer = new LitecoinNotifyer(conf.blockchainConfig.litecoin, sock);
  notifyer.connectToSocket().then();
  notifyer.subscribeToTransactions().then();
  it("should send the chainname if the blockchain creates a new block", (done) => {
    let isDone = false;
    notifyer.events.addListener(
      "onNewTransaction",
      (transaction, depth, chainname) => {
        if (isDone == false) {
          assert.strictEqual(chainname, "litecoin");
          done();
          isDone = true;
        }
      }
    );
  });
  it("should send the transaction as byte array if a new has been created", (done) => {
    let isDone = false;
    notifyer.events.addListener(
      "onNewTransaction",
      (transaction, chainname) => {
        const isByteArray = transaction && transaction.byteLength !== undefined;
        assert.strictEqual(isByteArray, true);
        if (isDone == false) {
          done();
          isDone = true;
        }
      }
    );
  });
  after(async () => {
    await notifyer.closeConnection();
  });
});

describe("LitecoinNotifyer subscribeToBlocks", () => {
  const sock = new zmq.Subscriber();
  const notifyer = new LitecoinNotifyer(conf.blockchainConfig.litecoin, sock);
  notifyer.connectToSocket().then();
  notifyer.subscribeToBlocks().then();
  it("should send the chainname if the blockchain created a new block", (done) => {
    let isDone = false;
    notifyer.events.addListener("onNewBlock", (block, chainname) => {
      assert.strictEqual(chainname, "litecoin");
      if (isDone == false) {
        done();
        isDone = true;
      }
    });
  });
  it("should send the block as byte array if a new has been created", (done) => {
    let isDone = false;
    notifyer.events.addListener("onNewBlock", (blockHash, chainname) => {
      const isByteArray = blockHash && blockHash.byteLength !== undefined;
      assert.strictEqual(isByteArray, true);
      if (isDone == false) {
        done();
        isDone = true;
      }
    });
  });
  after(async () => {
    await notifyer.closeConnection();
  });
});
