const ResponseMockFactory = () => {
  return {
    setHeader: (key, value) => {},
    send: (data) => {},
    code: (code) => {},
  };
};

module.exports = ResponseMockFactory;
