const assert = require("assert");
const EthereumNodeService = require("../../src/lib/services/ethereumNodeService");
const Web3 = require("web3");
const { blockchainConfig } = require("../../explorer-config.json");
const conf = blockchainConfig.ethereum.rpc;

const provider = new Web3.providers.HttpProvider(`${conf.url}:${conf.port}`);
const web3 = new Web3(provider);

describe("EthereumNodeService getBlockHash", () => {
  let service;
  beforeEach(() => {
    service = EthereumNodeService(web3, "ethereum");
  });
  it("should return a specific block hash", async () => {
    const height = 0;
    const hash = await service.getBlockHash({ height });
    assert.strictEqual(
      hash,
      "0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177"
    );
  });
});

describe("EthereumNodeService getBlock", () => {
  let service;
  beforeEach(() => {
    service = EthereumNodeService(web3, "ethereum");
  });
  it("should return a block with transaction hashes", async () => {
    const blockhash =
      "0x203827ffabdef862bf0d33a94d1efcbb2514f5610ab2b1f0cf78048ec862faba";
    const verbose = false;
    const block = await service.getBlock({ blockhash, verbose });
    assert.strictEqual(block.tx.length, 7);
    assert.strictEqual(typeof block.tx[0], "string");
  });
  it("should return a block with transaction data", async () => {
    const blockhash =
      "0x203827ffabdef862bf0d33a94d1efcbb2514f5610ab2b1f0cf78048ec862faba";
    const verbose = true;
    const block = await service.getBlock({ blockhash, verbose });
    assert.strictEqual(block.tx.length, 7);
    assert.strictEqual(typeof block.tx[0], "object");
  });
  it("it should return a block even with no transactions", async () => {
    const blockhash =
      "0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177";
    const verbose = true;
    const block = await service.getBlock({ blockhash, verbose });
    assert.strictEqual(block.tx.length, 0);
    assert.strictEqual(typeof block.tx[0], "undefined");
  });
});

describe("EthereumNodeService getBlockchainInfo", () => {
  let service;
  beforeEach(() => {
    service = EthereumNodeService(web3, "ethereum");
  });
  it("should return the current blockchain height", async () => {
    const { currentBlock } = await web3.eth.isSyncing();
    const { blocks } = await service.getBlockchainInfo();
    assert.strictEqual(currentBlock, blocks);
  });
});

describe("EthereumNodeService getTransaction", () => {
  let service;
  beforeEach(() => {
    service = EthereumNodeService(web3, "ethereum");
  });
  it("should return a transaction", async () => {
    const txid =
      "0xf0b9c9f56e8c5ab4d72818b4de6e01a9bd7d2fcdcd9e9ad17c76c33a58bc7520";
    const transaction = await service.getTransaction({ txid });
    assert.strictEqual(
      transaction.blockHash,
      "0x203827ffabdef862bf0d33a94d1efcbb2514f5610ab2b1f0cf78048ec862faba"
    );
  });
});
