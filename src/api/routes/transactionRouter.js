"use strict";

function TransactionRouter(router, ctrl) {
  router.route("/transactions/:chainname/:txid").get(ctrl.getByTxId);

  return router;
}

module.exports = TransactionRouter;
