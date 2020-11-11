"use strict";

function TransactionRouter(router, ctrl) {
  router.route("/transactions/:chainname/:txid").get(ctrl.getByTxId);
  router.route("/transactions/output/:chainname/:txid").get(ctrl.getOutput);

  return router;
}

module.exports = TransactionRouter;
