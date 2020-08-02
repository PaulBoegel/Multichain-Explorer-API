import React from "react";
import PropTypes from "prop-types";

const OutputTable = (props) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="text-white" scope="col">
            #
          </th>
          <th className="text-white" scope="col">
            VALUE
          </th>
        </tr>
      </thead>
      <tbody>
        {props.outputs.map((output) => {
          return (
            <tr key={output.index}>
              <th className="text-white" scope="row">
                {output.index}
              </th>
              <td className="text-white">{output.value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

OutputTable.propTypes = {
  outputs: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
};

export default OutputTable;
