import React from "react";
import PropTypes from "prop-types";

const TransactionList = (props) => {
  const nodes = props.nodes.map((node)=>{
    return {id: node.id, name: node.name.slice(0, 20) + "..."};
  })
  return (
    <ul>
      {nodes.map((node) => {
        return (
          <li key={node.id}>
            <div className="list-object">{node.name}</div>
          </li>
        );
      })}
    </ul>
  )
}

TransactionList.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  )
}

export default TransactionList;
