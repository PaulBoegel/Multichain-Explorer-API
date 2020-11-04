const assert = require("assert");
const LitecoinSync = require("../src/lib/sync/litecoinSync");
const blockMock = require("./mocks/blockMock.json");

describe("LitecoinSync Blockrange", () => {
  let service, transRepo, blockRepo;

  beforeEach(() => {
    service = {
      getBlockchainInfo: function () {
        return 10;
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
    sync = new LitecoinSync({ service, transRepo, blockRepo });
  });

  it("should synchronize a block", async () => {
    const result = await sync.blockrange({ endHeight: 0 });
    assert.strictEqual(result, 1);
  });
  it("should sync the entire blockchain if endHeight is not set", async () => {
    const result = await sync.blockrange();
    assert.strict(result, null);
  });
});
