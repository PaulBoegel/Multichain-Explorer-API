import React, { useState, useEffect } from "react";
import TransactionSearch from "./TransactionSearch";
import TransactionInfo from "./TransactionInfo";
import * as transactionApi from "../../api/transactionApi";

const TransactionPage = () => {
  const [txid, setTxid] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [displayInfo, setDisplayInfo] = useState("hide");
  const [transaction, setTransaction] = useState({
    txid: "",
    size: 0,
    locktime: 0,
    vin: [],
    vout: [],
  });

  const blockchainList = [];

  blockchainList.push({
    id: 0,
    name: "Litecoin",
    link: "#",
    value: "litecoin",
  });
  blockchainList.push({
    id: 1,
    name: "Bitcoin",
    link: "#",
    value: "bitcoin",
  });

  useEffect(() => {
    setBlockchain("litecoin");
  }, []);

  const handleTxIdChanged = ({ target }) => {
    setTxid(target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    transactionApi.getTransaction(blockchain, txid).then((_transaction) => {
      let index = 0;
      _transaction.vin = _transaction.vin.map((input) => {
        input = { index: index, txid: input.txid, output: input.vout };
        index++;
        return input;
      });
      index = 0;
      _transaction.vout = _transaction.vout.map((output) => {
        output = { index: index, value: output.value };
        index++;
        return output;
      });

      setTransaction(_transaction);
      setDisplayInfo("show");
    });
  };

  const handleBlockchainChanged = ({ target }) => {
    setBlockchain(target.value);
  };

  return (
    <div className="md-form mt-0">
      <div className="search-panel my-3 p-3 rounded">
        <h2>Transaction Search</h2>
        <TransactionSearch
          onSearchTextChange={handleTxIdChanged}
          onBlockchainChanged={handleBlockchainChanged}
          onSubmit={handleSearch}
          blockchainList={blockchainList}
        />
      </div>
      <TransactionInfo className={displayInfo} transaction={transaction} />
    </div>
  );
};

export default TransactionPage;
