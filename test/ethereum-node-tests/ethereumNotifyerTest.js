const assert = require("assert");
const { blockchainConfig } = require("../../explorer-config.json");
const conf = blockchainConfig.ethereum;
const EthereumNotifyer = require("../../src/lib/notifyer/ethereumNotifyer");

describe("EthereumNotifyer subscribeToBlocks", () => {
  notifyer = EthereumNotifyer(conf);
  notifyer.connectToSocket().then();
  notifyer.subscribeToBlocks().then();
  it.only("should send the block header if the blockchain creates a new block", (done) => {
    let isDone = false;
    notifyer.events.addListener("onNewBlock", (block, chainname) => {
      if (isDone == false) {
        console.log(block);
        assert.strictEqual(chainname, "ethereum");
        done();
        isDone = true;
      }
    });
  });
});
