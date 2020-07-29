import React from "react";
import { Route } from "react-router-dom";
import TransactionPage from "./Transaction/TransactionPage";

const App = () => {
  return (
    <div className="container-fluid">
      <Route exact path="/" component={TransactionPage} />
    </div>
  );
};

export default App;
