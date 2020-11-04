const assert = require("assert");
const LitecoinSync = require("../src/lib/sync/litecoinSync");
const blockMock = require("./mocks/blockMock.json");

describe("LitecoinSync Blockrange", () => {
  let service, transRepo, blockRepo;

  beforeEach(() => {
    service = {
      GetBlockHash: function ({ height }) {
        return blockMock.hash;
      },
      GetBlock: function ({ hash }) {
        return blockMock;
      },
    };
    transRepo = {
      Connect: function () {
        return true;
      },
      AddMany: function (transactions) {
        return transactions.length;
      },
    };
    blockRepo = {
      Connect: function () {
        return true;
      },
      Add: function (block) {
        return true;
      },
      Get: function (blockParam) {
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
    const result = await sync.Blockrange({ endHeight: 0 });
    assert.strictEqual(result, 1);
  });
});