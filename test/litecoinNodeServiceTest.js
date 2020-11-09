const assert = require("assert");
const LitecoinNodeService = require("../src/lib/services/litecoinNodeService");
const { RPCClient } = require("rpc-bitcoin");
const configJSON = require("../explorer-config.json");

describe("LitecoinNodeService getBlock", () => {
  const config = configJSON.blockchainConfig.litecoin.rpc;
  const rpc = new RPCClient(config);
  const service = new LitecoinNodeService(rpc, "litecoin");

  it("should return the genesis block", async () => {
    const blockhash =
      "12a765e31ffd4059bada1e25190f6e98c99d9714d334efa41a195a7e7e04bfe2";
    const genesis = await service.getBlock({ blockhash, verbose: false });
    assert.strictEqual(genesis.height, 0);
  });

  it("should return an array with decoded transactions", async () => {
    const blockhash =
      "12a765e31ffd4059bada1e25190f6e98c99d9714d334efa41a195a7e7e04bfe2";
    const block = await service.getBlock({ blockhash, verbose: true });
    assert.strictEqual(block.tx[0].txid.length, 64);
  });
});

describe("LitecoinNodeService getTransaction", () => {
  const config = configJSON.blockchainConfig.litecoin.rpc;
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

describe("LitecoinNodeService decodeTransaction", () => {
  const config = configJSON.blockchainConfig.litecoin.rpc;
  const rpc = new RPCClient(config);
  const service = new LitecoinNodeService(rpc, "litecoin");
  it("should decode a byte array to transaction object", async () => {
    const bytes =
      "020000000197e92f0a0530847d05dc53b509d569c04bf0410331cc12d8f4d11f3611d258ad0a0000008a47304402206ac205c7359982aa805b2c3538ebc0797572ae525f6224c6293a8d0e9d78680b022037ff5520a73aeec785fd39d9d237bc0aeaf52170f9d5b4523d67830bc8b9855b0141045793fd22b68becaa9e800ecf76c3008156637b193e9c0c77507bc72d09565998ed621cbdb074e6560c616afcfa412df85c88bc31fa858ac23ab0e378d9f013b6feffffff13a8610000000000001976a9147e9ca0caf6aadd3aaf7dc39eb91b14a9e0ee03b488aca8610000000000001976a9145a38c35dc3d90110dae261eea5176d9b60ab28fa88aca86100000000000017a914e73b248bc4ce24bcb93a2da227457fb5bbf145a087a86100000000000017a91467ef2cb43e85e57148d9a0a5324681157f48ddf887a86100000000000017a914e1426be6f7f9a0743b67b67f7ba5a330d685550087a86100000000000017a91447d591eca59a9745a0b717c5d2d5394c89d2033787a8610000000000001976a9148636a1de53ce7c20090e6c2c6e42a8247a70f50c88aca86100000000000017a9145cf9ed7046e9c35a22fd67b797fa4b8955bb952c87a8610000000000001976a914eec4c9fff77108600b13e9a24b04e2ad7c0eee2288aca86100000000000017a914617d424b92122fcf9b88726aad89376d2beb347e87a86100000000000017a914a996820e69d163e0f5b1583ae11c1bf10d780b1287a8610000000000001976a914e4928316b5cda2ddeb4bbb5dd3d7ba2ee9f161e588aca86100000000000017a914bca712827acecbf7cde46edbcdbd3ee205607c1987a86100000000000017a914ea575fc327d4e69e3444c2b85a000845ae9adec787a8610000000000001976a9145b2224ba49bfff766ad7969e8a031d63fa45197d88aca8610000000000001976a9142cc5607ced4ea5e0e067a8f5b58541a441c530b588ac5a3e5800000000001976a914530f238ff15a715690d11aedc71699262fe4798588aca86100000000000017a9142b63ab13cbee56bb1a7fe130f762348acb31867487a86100000000000017a914009e5fab02471fd5083c37353c48847773e40d2d87c79e1d00";
    const buffer = Buffer.from(bytes, "hex");
    const transaction = await service.decodeTransaction(buffer);
    assert.strictEqual(
      transaction.txid,
      "574d7fb83e01988b50999ebbb7fcddc6241725b15a3447a90d5f947c4e8ef242"
    );
  });
});
describe("LitecoinNodeService getBlockchainInfo", () => {
  const config = configJSON.blockchainConfig.litecoin.rpc;
  const rpc = new RPCClient(config);
  const service = new LitecoinNodeService(rpc, "litecoin");
  it("should return the actual blockchain info object", async () => {
    const { chain } = await service.getBlockchainInfo();
    assert.strictEqual(chain, "main");
  });
});
