import React from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";
import Select from "../common/Select";

const TransactionSearch = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div className="form-group">
        <Select
          items={props.blockchainList}
          onChange={props.onBlockchainChanged}
        />
      </div>

      <div className="form-group">
        <TextInput
          ariaLabel="search"
          placeholder="Search for transaction"
          onChange={props.onSearchTextChange}
          onKeyUp={props.onKeyUp}
        />
      </div>
      {/* <button type="submit" className="btn btn-light">
        Search
      </button> */}
    </form>
  );
};

TransactionSearch.propTypes = {
  onSearchTextChange: PropTypes.func.isRequired,
  onBlockchainChanged: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  blockchainList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ).isRequired,
};

export default TransactionSearch;
