const assert = require("assert");
const EthereumNodeService = require("../../src/lib/services/ethereumNodeService");
const Web3 = require("web3");
const confJSON = require("../explorer-config.json");
const conf = confJSON.ethereum.rpc;

const provider = new Web3.providers.HttpProvider(`${conf.url}:${conf.port}`);
const web3 = new Web3(provider);

describe("EthereumNodeService getBlockHash", () => {
  let service;
  beforeEach(() => {
    service = EthereumNodeService(web3, "ethereum");
  });
  it("should return a specific block hash", async () => {
    const hash = await service.getBlockHash({ height });
    assert.strictEqual(hash, null);
  });
});
