import React from "react";
import PropTypes from "prop-types";

const SearchForm = (props) => {
  return (
    <input
      className="form-control"
      type="text"
      placeholder={props.placeholder}
      aria-label={props.ariaLabel}
      onClick={props.onClick}
    />
  );
};

SearchForm.propTypes = {
  onClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default SearchForm;
