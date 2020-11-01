import React, { useState, useEffect } from "react";
import TransactionSearch from "./TransactionSearch";
import TransactionInfo from "./TransactionInfo";
import TransactionGraph from "./TransactionGraph";
import * as transactionApi from "../../api/transactionApi";
import TransactionList from "./TransactionList";

const TransactionPage = () => {
  const [txid, setTxid] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [displayInfo, setDisplayInfo] = useState("hide");
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [transform, setTransform] = useState({k: 1, x: 0, y: 0});
  const [activeNode, setActiveNode] = useState({
    id: 0,
    name: "",
    parent: "",
    vx: 0,
    vy: 0,
    x: 0,
    y: 0
  });
  const [transaction, setTransaction] = useState({
    txid: "",
    size: 0,
    locktime: 0,
    vin: [{txid: ""}],
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

  const pushTransactionInputs = (inputs, links, nodes, targetId) => {
    let nodesIndex = nodes.length;
    inputs.forEach((input) => {
      const i = nodesIndex++
      links.push({source: i, target: targetId})
      nodes.push({id: i, name: input.txid, active: false});
    });
  }

  const transactionSearch = () => {
    transactionApi.getTransaction(blockchain, txid).then((_transaction) => {
      _transaction.vin = filterInput(_transaction.vin);
      _transaction.vout = filterOutput(_transaction.vout);

      nodes.length = 0;
      links.length = 0;

      const activeNode = {id: 0, name: _transaction.txid, x: 0, y: 0, k: 0, expand: true, active: true};
      nodes.push(activeNode);
      pushTransactionInputs(_transaction.vin, links, nodes, 0);

      setActiveNode(activeNode);
      setTransaction(_transaction);
      setDisplayInfo("show");
    });
  }

  const getTransaction = ({name, id}) => {
    transactionApi.getTransaction(blockchain, name).then((_transaction) => {
      _transaction.vin = filterInput(_transaction.vin);
      _transaction.vout = filterOutput(_transaction.vout);

      nodes.map(node => Object.assign(node, {active: false}))
      links.map(link => Object.assign(link, {active: false}))
      const currentNode = nodes.find(node => node.name == name)

      currentNode.active = true;
      if(currentNode.expand == true) {
        setTransaction(_transaction);
        return;
      }

      currentNode.expand = true;
      pushTransactionInputs(_transaction.vin, links, nodes, id);
      setTransaction(_transaction);
    });
  }

  const handleTxIdChanged = ({ target }) => {
    setTxid(target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    transactionSearch();
  };

  const handleKeyUp = (event) => {
    event.preventDefault()
    if(event.key === 'ENTER' || event.keyCode === 13)
    transactionSearch();
  }

  const handleNodeMouseClick = (event, data) => {
    event.preventDefault();
    setActiveNode(data)
    getTransaction(data);
  }

  const handleObjectOnClick = (event) => {
    event.preventDefault();
    const data = {
      id: event.target.getAttribute('data-id'),
      name: event.target.getAttribute('data-name')
    }
    setActiveNode(data)
    getTransaction(data);
  }

  const handleZoom = (transform) => {
    setTransform(transform);
  }

  const handleBlockchainChanged = ({ target }) => {
    setBlockchain(target.value);
  };

  const filterInput = (inputs) => {
    let index = 0;
    return inputs.map((input) => {
      input = { index: index, txid: input.txid, output: input.vout };
      index++;
      return input;
    });
  }

  const filterOutput = (outputs) => {
    let index = 0;
    let totalValue = 0;
    const newOutput = outputs.map((output) => {
      output = { index: index, value: output.value };
      totalValue += output.value;
      index++;
      return output;
    });
    newOutput.totalValue = totalValue;
    return newOutput;
  }

  return (
    <div className="md-form mt-0 grid">
      <div className="search-panel my-3 p-3 rounded grid-right">
        <div className="search">
          <TransactionSearch
            onSearchTextChange={handleTxIdChanged}
            onBlockchainChanged={handleBlockchainChanged}
            onSubmit={handleSearch}
            onKeyUp={handleKeyUp}
            blockchainList={blockchainList}
          />
        </div>

        <div className="object-list">
          <TransactionList
            nodes={nodes}
            onClick={handleObjectOnClick}/>
        </div>
      </div>
      <div className="grid-left">
        <div className="analysis-nav"></div>
        <div className="widget">
          <TransactionGraph
            activeNode={activeNode}
            nodes={nodes}
            links={links}
            transform={transform}
            onNodeMouseClick={handleNodeMouseClick}
            onHandleZoom={handleZoom} />
        </div>
        <div className="widget-info">
          <TransactionInfo
            className={displayInfo}
            transaction={transaction} />
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
