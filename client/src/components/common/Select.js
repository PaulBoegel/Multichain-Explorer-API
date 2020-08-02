import React from "react";
import PropTypes from "prop-types";

const Select = (props) => {
  return (
    <select className="form-control from-control-lg" onChange={props.onChange}>
      {props.items.map((item) => {
        return (
          <option key={item.id} value={item.value}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
};

Select.propTypes = {
  onChange: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ).isRequired,
};

export default Select;
