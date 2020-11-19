const assert = require("assert");
const LitecoinSync = require("../../src/lib/sync/litecoinSync");
const TransactionHandler = require("../../src/lib/handler/transactionHandler");
const sinon = require("sinon");
const blockMock = require("../mocks/blockMock.json");
const BlockLogger = require("../../src/lib/logger/blockLogger");

describe("LitecoinSync Blockrange", () => {
  let service, transRepo, blockRepo, sync;
  sinon.stub(BlockLogger, "info");
  beforeEach(() => {
    service = {
      chainname: "litecoin",
      getBlockchainInfo: function () {
        return 1;
      },
      getBlockHash: function ({ height }) {
        return blockMock.hash;
      },
      getBlock: function ({ hash }) {
        return blockMock;
      },
    };
    transRepo = {
      connect: function () {
        return true;
      },
      addMany: function (transactions) {
        return transactions.length;
      },
    };
    blockRepo = {
      connect: function () {
        return true;
      },
      add: function (block) {
        return true;
      },
      get: function (blockParam) {
        return [
          {
            height: 0,
            hash:
              "12a765e31ffd4059bada1e25190f6e98c99d9714d334efa41a195a7e7e04bfe2",
          },
        ];
      },
    };
    getBlockchainInfo = sinon.spy(service, "getBlockchainInfo");
    const transactionHandler = TransactionHandler(transRepo, blockRepo);
    sync = LitecoinSync({ service, transactionHandler });
  });

  it("should fire blockchainSynchronized event, after end height was reached", (done) => {
    sync.events.addListener("blockchainSynchronized", (chainname) => {
      assert(chainname, "litecoin");
      done();
    });
    sync.blockrange().then((result) => {});
  });

  after(() => {
    BlockLogger.info.restore();
  });
});
