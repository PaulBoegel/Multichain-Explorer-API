import React from "react";
import { Route } from "react-router-dom";
import PaymentPage from "./Payment/PaymentPage";

const App = () => {
  return (
    <div className="container-fluid">
      <Route exact path="/" component={PaymentPage} />
    </div>
  );
};

export default App;
