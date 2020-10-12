import React from "react";
import PropTypes from "prop-types";
import InputTable from "./InputTable";
import OutputTable from "./OutputTable";

const TransactionInfo = (props) => {
  return (
    <>
      <div className={`information-panel my-1 p-3 rounded ${props.className}`}>
        <h4 className="text-white medium">GENERAL</h4>
        <div className="media text-muted pt-2">
          <strong className="text-white medium">TXID:</strong>
          <span className="pl-2 text-white small">
            {props.transaction.txid}
          </span>
        </div>
        <div className="media text-muted">
          <strong className="text-white medium">SIZE:</strong>
          <span className="pl-2 text-white small">
            {props.transaction.size}
          </span>
        </div>
        <div className="media text-muted">
          <strong className="text-white medium">TOTAL VALUE:</strong>
          <span className="pl-2 text-white small">
            {props.transaction.vout.totalValue}
          </span>
        </div>
        <div className="media text-muted">
          <strong className="text-white medium">LOCKTIME:</strong>
          <span className="pl-2 pb-4 text-white small">
            {props.transaction.locktime}
          </span>
        </div>
      </div>
      {/* <div className={`information-panel my-1 p-3 rounded ${props.className}`}>
        <h4 className="text-white medium">INPUTS:</h4>
        <InputTable inputs={props.transaction.vin} />
      </div> */}
      {/* <div className={`information-panel my-1 p-3 rounded ${props.className}`}>
        <h4 className="text-white medium">OUTPUTS:</h4>
        <OutputTable outputs={props.transaction.vout} />
      </div> */}
    </>
  );
};

TransactionInfo.propTypes = {
  className: PropTypes.string,
  transaction: PropTypes.shape({
    txid: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    locktime: PropTypes.number.isRequired,
    vin: PropTypes.arrayOf(
      PropTypes.shape({
        txid: PropTypes.string,
        output: PropTypes.number,
      })
    ),
    vout: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default TransactionInfo;
