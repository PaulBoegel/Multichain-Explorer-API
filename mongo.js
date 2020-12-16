db.blocks.aggregate([
  {
    $match: {
      chainId: 2,
      "tx.txid": {
        $in: [
          "3db20cb65f44236f36f0e4145c8ca1370112d25c41f785dab85ec2cc70b687a4",
          "76714e5ae3bdd93b7382a1447300fdb9d596323ebd7aea3cef2d9cc2aafd13f7",
        ],
      },
    },
  },
  { $unwind: "$tx" },
  {
    $match: {
      "tx.txid": {
        $in: [
          "3db20cb65f44236f36f0e4145c8ca1370112d25c41f785dab85ec2cc70b687a4",
          "76714e5ae3bdd93b7382a1447300fdb9d596323ebd7aea3cef2d9cc2aafd13f7",
        ],
      },
    },
  },
  { $project: { _id: 0 } },
]);
