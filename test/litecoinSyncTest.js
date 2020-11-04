const assert = require("assert");
const LitecoinSync = require("../src/lib/sync/litecoinSync");
const sinon = require("sinon");
const blockMock = require("./mocks/blockMock.json");

describe("LitecoinSync Blockrange", () => {
  let service, transRepo, blockRepo;

  beforeEach(() => {
    service = {
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
    sync = new LitecoinSync({ service, transRepo, blockRepo });
  });

  it("should check the blockchain info, if endHeight has not been defined", async () => {
    await sync.blockrange();
    assert(getBlockchainInfo.calledOnce);
  });
  it("should not check block info, if endHeight has been defined", async () => {
    await sync.blockrange(0);
    assert(getBlockchainInfo.called === false);
  });
  it("should fire blockchainSynchronized event, after end height was reached", (done) => {
    sync.events.addListener("blockchainSynchronized", (chainname) => {
      assert(chainname, "litecoin");
      done();
    });
    sync.blockrange().then((result) => {});
  });
});
