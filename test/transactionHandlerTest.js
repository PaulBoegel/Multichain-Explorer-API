const assert = require("assert");
const sinon = require("sinon");
const { RPCClient } = require("rpc-bitcoin");
const LitecoinNodeService = require("../src/lib/services/litecoinNodeService");
const TransactionHandler = require("../src/lib/handler/transactionHandler");
const configJSON = require("../explorer-config.json");

describe("TransactionHandler saveBlockTransactions", () => {
  const blockRepo = {
    connect: () => {},
    add: (block) => {},
  };
  const transRepo = {
    connect: () => {},
    addMany: (transaction) => {
      return transaction.length;
    },
  };
  const rpcConf = configJSON.blockchainConfig.litecoin.rpc;
  const rpc = new RPCClient(rpcConf);
  const service = new LitecoinNodeService(rpc, "litecoin");
  const addBlock = sinon.spy(blockRepo, "add");
  const addTransaction = sinon.spy(transRepo, "addMany");
  it("should save requested block data", async () => {
    const blockhash =
      "4dae7c13977c2e6b776221e6e7f1bd738f3d5d8cabf40a60f5cbb5b524d4d6bd";

    const handler = new TransactionHandler(transRepo, blockRepo);
    result = await handler.saveBlockTransactions(blockhash, service);
    assert(
      addBlock.withArgs({
        height: 1941194,
        hash: blockhash,
        tx: [
          "159cc2d17066824b68b3a182e566476b25d54a184061369cd080b5e25bf5280a",
        ],
      }).calledOnce
    );
  });
});
