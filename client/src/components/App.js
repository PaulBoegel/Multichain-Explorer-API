import React from "react";
import { Route } from "react-router-dom";
import TransactionInputPage from "./Transaction/TransactionInputPage";
import TransactionOutputPage from "./Transaction/TransactionOutputPage";

const App = () => {
  return (
    <div className="container-fluid">
      <Route exact path="/" component={TransactionInputPage} />
      <Route path="/outputs" component={TransactionOutputPage} />
    </div>
  );
};

export default App;
