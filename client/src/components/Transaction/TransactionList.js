import React from "react";
import PropTypes from "prop-types";

const TransactionList = (props) => {
  const nodes = props.nodes.map((node)=>{
    return {id: node.id, active: node.active, name: node.name, shortName: node.name.slice(0, 20) + "..."};
  })
  return (
    <ul>
      {nodes.map((node) => {
        return (
          <li key={node.id} className={node.active ? "active" : ""} onClick={props.onClick}>
            <div className="list-object" data-id={node.id} data-name={node.name}>{node.shortName}</div>
          </li>
        );
      })}
    </ul>
  )
}

TransactionList.propTypes = {
  onClick: PropTypes.func,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  )
}

export default TransactionList;
