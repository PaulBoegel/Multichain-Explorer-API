import React, { useState, useEffect } from "react";
import TransactionSearch from "./TransactionSearch";
import TransactionInfo from "./TransactionInfo";
import TransactionGraph from "./TransactionGraph";
import * as transactionApi from "../../api/transactionApi";
import TransactionList from "./TransactionList";

const TransactionOutputPage = () => {
  const [txid, setTxid] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [displayInfo, setDisplayInfo] = useState("hide");
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState({
    id: 0,
    name: "",
    parent: "",
    vx: 0,
    vy: 0,
    x: 0,
    y: 0,
  });
  const [transaction, setTransaction] = useState({
    txid: "",
    size: 0,
    locktime: 0,
    vin: [{ txid: "" }],
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
  blockchainList.push({
    id: 2,
    name: "Dash",
    link: "#",
    value: "dash",
  });

  useEffect(() => {
    setBlockchain("litecoin");
  }, []);

  const handleTxIdChanged = ({ target }) => {
    setTxid(target.value);
  };

  const handleBlockchainChanged = ({ target }) => {
    setBlockchain(target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    transactionSearch();
  };

  const transactionSearch = () => {
    transactionApi
      .getTransaction(blockchain, txid)
      .then(async (_transaction) => {
        const outputTransactions = await getOutputTransactions(
          _transaction.txid
        );

        nodes.length = 0;
        links.length = 0;

        const activeNode = {
          id: 0,
          name: _transaction.txid,
          x: 0,
          y: 0,
          k: 0,
          expand: true,
          active: true,
        };
        nodes.push(activeNode);
        pushOutputTransactions(outputTransactions, links, nodes, 0);

        setActiveNode(activeNode);
        setTransaction(_transaction);
        setDisplayInfo("show");
      });
  };

  const getTransaction = ({ name, id }) => {
    transactionApi
      .getTransaction(blockchain, name)
      .then(async (_transaction) => {
        const outputTransactions = await getOutputTransactions(
          _transaction.txid
        );

        nodes.map((node) => Object.assign(node, { active: false }));
        links.map((link) => Object.assign(link, { active: false }));
        const currentNode = nodes.find((node) => node.name == name);

        currentNode.active = true;
        // if (currentNode.expand == true) {
        //   setTransaction(_transaction);
        //   return;
        // }

        currentNode.expand = true;
        pushOutputTransactions(outputTransactions, links, nodes, id);
        setTransaction(_transaction);
      });
  };

  const pushOutputTransactions = (outputs, links, nodes, targetId) => {
    let nodesIndex = nodes.length;
    outputs.forEach((output) => {
      const existingNode = nodes.find((node) => node.name == output.txid);
      let source = 0;
      if (existingNode) {
        source = existingNode.id;
      } else {
        source = nodesIndex++;
        nodes.push({ id: source, name: output.txid, active: false });
      }

      const existingLink = links.find(
        (link) => link.source === source && link.target === targetId
      );
      if (existingLink === undefined) links.push({ source, target: targetId });
    });
  };

  const getOutputTransactions = async (_txid) => {
    const _transactions = await transactionApi.getOutputTransactions(
      blockchain,
      _txid
    );
    let index = 0;
    return _transactions.map((transaction) => {
      transaction = { index: index, txid: transaction.txid };
      index++;
      return transaction;
    });
  };

  const handleZoom = (transform) => {
    setTransform(transform);
  };

  const handleKeyUp = (event) => {
    event.preventDefault();
    if (event.key === "ENTER" || event.keyCode === 13) transactionSearch();
  };

  const handleObjectOnClick = (event) => {
    event.preventDefault();
    const data = {
      id: event.target.getAttribute("data-id"),
      name: event.target.getAttribute("data-name"),
    };
    setActiveNode(data);
    // getTransaction(data);
  };

  const handleNodeMouseClick = (event, data) => {
    event.preventDefault();
    setActiveNode(data);
    getTransaction(data);
  };

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
          <TransactionList nodes={nodes} onClick={handleObjectOnClick} />
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
            onHandleZoom={handleZoom}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionOutputPage;
