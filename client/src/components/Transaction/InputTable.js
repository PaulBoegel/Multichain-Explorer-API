import React from "react";
import PropTypes from "prop-types";

const InputTable = (props) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="text-white" scope="col">
            #
          </th>
          <th className="text-white" scope="col">
            TXID
          </th>
          <th className="text-white" scope="col">
            OUTPUT
          </th>
        </tr>
      </thead>
      <tbody>
        {props.inputs.map((input) => {
          return (
            <tr key={input.index}>
              <th className="text-white" scope="row">
                {input.index}
              </th>
              <td className="text-white">{input.txid}</td>
              <td className="text-white">{input.output}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

InputTable.propTypes = {
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      txid: PropTypes.string.isRequired,
      output: PropTypes.number.isRequired,
    }).isRequired
  ),
};

export default InputTable;
