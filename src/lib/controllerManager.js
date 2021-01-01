function ControllerManager() {
  const controllerArray = [];

  return {
    setController(controller) {
      controllerArray.push(controller);
    },
    getController(chainId) {
      return controllerArray.find((entry) => entry.chainId == chainId);
    },
  };
}

module.exports = ControllerManager;
