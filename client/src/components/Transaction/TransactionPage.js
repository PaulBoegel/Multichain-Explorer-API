import React, { useState } from "react";
import SearchForm from "../common/SearchForm";
import * as transactionApi from "../../api/transactionApi";

const TransactionPage = () => {
  const [txid, setTxid] = useState("");

  const handleTxIdChanged = ({ target }) => {
    setTxid(target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    transactionApi.getTransaction("litecoin", txid);
  };

  return (
    <div className="md-form mt-0">
      <h2>Payment</h2>
      <SearchForm
        onChange={handleTxIdChanged}
        onSubmit={handleSearch}
        placeholder="Search for transaction"
        ariaLabel="search"
      />
    </div>
  );
};

export default TransactionPage;
