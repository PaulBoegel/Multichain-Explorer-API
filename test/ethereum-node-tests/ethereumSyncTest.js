const assert = require("assert");
const sinon = require("sinon");
const EthereumSync = require("../../src/lib/sync/ethereumSync");
const EthereumNodeService = require("../../src/lib/services/ethereumNodeService");
const TransactionHandler = require("../../src/lib/handler/transactionHandler");
const BlockLogger = require("../../src/lib/logger/blockLogger");
const Web3 = require("web3");
const { blockchainConfig } = require("../../explorer-config.json");
const conf = blockchainConfig.ethereum.rpc;
const provider = new Web3.providers.HttpProvider(`${conf.url}:${conf.port}`);
const web3 = new Web3(provider);

describe("EthereumSync blockrange", () => {
  let sync;
  let service = EthereumNodeService(web3, "ethereum");
  let transactionHandler = TransactionHandler({}, {});

  let spyGetBlock;
  sinon.stub(transactionHandler, "saveBlockData").returns(1);
  sinon.stub(transactionHandler, "saveBlockDataWithHash").returns(1);
  sinon.stub(BlockLogger, "info");

  beforeEach(() => {
    spyGetBlock = sinon.spy(service, "getBlock");
    sync = EthereumSync({
      service,
      transactionHandler,
    });
  });

  it("should call service.getBlock twice if syncHeight is 0", async () => {
    sinon
      .stub(transactionHandler, "getHighestBlockHash")
      .returns(
        "0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177"
      );
    sync.setSyncHeight({ height: 0, active: true });
    await sync.blockrange();
    const returns = await Promise.all(spyGetBlock.returnValues);
    assert.strictEqual(spyGetBlock.calledTwice, true);
    assert.strictEqual(returns[0].height, 0);
    assert.strictEqual(returns[1].height, 1);
  });

  it("should call service.getBlock thrice times if syncHeight is 1", async () => {
    sinon
      .stub(transactionHandler, "getHighestBlockHash")
      .returns(
        "0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177"
      );
    sync.setSyncHeight({ height: 1, active: true });
    await sync.blockrange();
    const returns = await Promise.all(spyGetBlock.returnValues);
    assert.strictEqual(spyGetBlock.calledThrice, true);
    assert.strictEqual(returns[0].height, 0);
    assert.strictEqual(returns[1].height, 1);
    assert.strictEqual(returns[2].height, 2);
  });

  afterEach(() => {
    spyGetBlock.restore();
    transactionHandler.getHighestBlockHash.restore();
  });

  after(() => {
    transactionHandler.saveBlockData.restore();
    transactionHandler.saveBlockDataWithHash.restore();
  });
});
