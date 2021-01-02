function Resolvers({ controllerManager }) {
  return {
    RootQuery: {
      async blocks(root, { height, hash, chainId, pageSize, page }, context) {
        const controller = controllerManager.getController(chainId);
        const result = await controller.blockSearch({
          height,
          hash,
          pageSize,
          page,
        });
        return result;
      },
      async transactions(root, { txid, chainId, pageSize, page }, context) {
        const controller = controllerManager.getController(chainId);
        const result = await controller.transactionSearch({
          txid,
          pageSize,
          page,
        });
        return result;
      },
      async address(root, { address, chainId, pageSize, page }, context) {
        const controller = controllerManager.getController(chainId);
        const result = await controller.addressSearchQuery({
          address,
          pageSize,
          page,
        });
        return result;
      },
      async searchEntity(root, { chainId, searchString }, context) {
        const controller = controllerManager.getController(chainId);
        const id = await controller.searchEntityId({ searchString });
        return id;
      },
      async getHeight(root, { chainId }, context) {
        const controller = controllerManager.getController(chainId);
        const height = await controller.getHeight();
        return height ? height : 0;
      },
    },
  };
}

module.exports = Resolvers;
