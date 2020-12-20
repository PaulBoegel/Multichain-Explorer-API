db.blocks.aggregate([
  {
    $match: {
      chainId: 0,
      "tx.vout.addresses": "Ler4HNAEfwYhBmGXcFP2Po1NpRUEiK8km2",
    },
  },
  { $unwind: "$tx" },
  { $match: { "tx.vout.addresses": "Ler4HNAEfwYhBmGXcFP2Po1NpRUEiK8km2" } },
  { $group: { _id: null, count: { $sum: 1 } } },
]);
