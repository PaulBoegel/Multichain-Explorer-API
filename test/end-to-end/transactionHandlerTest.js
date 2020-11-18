const assert = require("assert");
const sinon = require("sinon");
const { RPCClient } = require("rpc-bitcoin");
const Web3 = require("web3");
const LitecoinNodeService = require("../../src/lib/services/litecoinNodeService");
const EthereumNodeService = require("../../src/lib/services/ethereumNodeService");
const TransactionHandler = require("../../src/lib/handler/transactionHandler");
const configJSON = require("../../explorer-config.json");

describe("TransactionHandler saveBlockTransactions", () => {
  let addBlock;
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
  const web3Conf = configJSON.blockchainConfig.ethereum.rpc;
  const provider = new Web3.providers.HttpProvider(
    `${web3Conf.url}:${web3Conf.port}`
  );
  const web3 = new Web3(provider);
  const litecoinService = new LitecoinNodeService(rpc, "litecoin");
  const ethereumService = new EthereumNodeService(web3, "ethereum");
  const addTransaction = sinon.spy(transRepo, "addMany");

  beforeEach(() => {
    addBlock = sinon.spy(blockRepo, "add");
  });

  it("should save requested block data of a bitcoin fork", async () => {
    const blockData = {
      height: 1941194,
      hash: "4dae7c13977c2e6b776221e6e7f1bd738f3d5d8cabf40a60f5cbb5b524d4d6bd",
      tx: [
        {
          txid:
            "159cc2d17066824b68b3a182e566476b25d54a184061369cd080b5e25bf5280a",
        },
      ],
    };

    const handler = new TransactionHandler(transRepo, blockRepo);
    result = await handler.saveBlockData({
      blockData,
      service: litecoinService,
    });
    assert(
      addBlock.withArgs({
        height: 1941194,
        hash:
          "4dae7c13977c2e6b776221e6e7f1bd738f3d5d8cabf40a60f5cbb5b524d4d6bd",
        tx: [
          "159cc2d17066824b68b3a182e566476b25d54a184061369cd080b5e25bf5280a",
        ],
        chainname: "litecoin",
      }).calledOnce
    );
  });
  it("should save requested block data of an ethereum fork", async () => {
    const blockData = {
      number: 3,
      hash:
        "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
      tx: [
        {
          txid:
            "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
        },
      ],
    };
    const handler = new TransactionHandler(transRepo, blockRepo);
    result = await handler.saveBlockData({
      blockData,
      service: ethereumService,
    });
    addBlock.withArgs({
      number: 3,
      hash:
        "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
      tx: [
        "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
      ],
      chainname: "ethereum",
    }).calledOnce;
  });

  afterEach(() => {
    addBlock.restore();
  });
});
