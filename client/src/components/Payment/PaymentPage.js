import React from "react";
import SearchForm from "../common/SearchForm";
import * as transactionApi from "../../api/transactionApi";

const PaymentPage = () => {
  const handleSearch = () => {
    transactionApi.getTransaction("litecoin", "");
  };

  return (
    <div className="md-form mt-0">
      <h2>Payment</h2>
      <SearchForm
        onClick={handleSearch}
        placeholder="Search for transaction"
        ariaLabel="search"
      />
    </div>
  );
};

export default PaymentPage;
