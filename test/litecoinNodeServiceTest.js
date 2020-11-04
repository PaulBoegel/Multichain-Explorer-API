const assert = require("assert");
const LitecoinNodeService = require("../src/lib/services/litecoinNodeService");
const { RPCClient } = require("rpc-bitcoin");
function GetConfig() {
  return {
    url: "http://127.0.0.1",
    user: "pboegelsack",
    pass: "test",
    port: "8332",
  };
}

describe("LitecoinNodeService GetBlock", () => {
  const config = GetConfig();
  const rpc = new RPCClient(config);
  const service = new LitecoinNodeService(rpc, "litecoin");

  it("should return the genesis block", async () => {
    const blockhash =
      "12a765e31ffd4059bada1e25190f6e98c99d9714d334efa41a195a7e7e04bfe2";
    const genesis = await service.getBlock({ blockhash, verbose: false });
    assert.strictEqual(genesis.height, 0);
    assert.strictEqual(genesis.version, 1);
    assert.strictEqual(genesis.versionHex, "00000001");
  });

  it("should return an array with decoded transactions", async () => {
    const blockhash =
      "12a765e31ffd4059bada1e25190f6e98c99d9714d334efa41a195a7e7e04bfe2";
    const block = await service.getBlock({ blockhash, verbose: true });
    assert.strictEqual(block.tx[0].txid.length, 64);
  });
});

describe("LitecoinNodeService GetTransaction", () => {
  const config = GetConfig();
  const rpc = new RPCClient(config);
  const service = new LitecoinNodeService(rpc, "litecoin");
  it("should return a decoded transaction", async () => {
    const blockhash =
      "80ca095ed10b02e53d769eb6eaf92cd04e9e0759e5be4a8477b42911ba49c78f";
    const block = await service.getBlock({ blockhash, verbose: false });
    const txid = block.tx[0];
    const transaction = await service.getTransaction({ txid, verbose: true });
    assert.strictEqual(
      transaction.hash,
      "fa3906a4219078364372d0e2715f93e822edd0b47ce146c71ba7ba57179b50f6"
    );
  });
});
