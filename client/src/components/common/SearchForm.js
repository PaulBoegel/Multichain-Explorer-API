import React from "react";
import PropTypes from "prop-types";

const SearchForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <input
        className="form-control"
        type="text"
        placeholder={props.placeholder}
        aria-label={props.ariaLabel}
        onChange={props.onChange}
      />
    </form>
  );
};

SearchForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default SearchForm;
