db.blocks.aggregate([
  { $match: { height: 12323 } },
  { $group: { _id: null, count: { $sum: 1 } } },
]);
