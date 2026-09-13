const getStoreQuery = `
  query GetStore($storeId: ID, $clientId: String) {
    getStore(storeId: $storeId, clientId: $clientId) {
      id name code phone state
      cities { name }
      address country operationModel
      serviceFee { PICK_AND_COLLECT DELIVERY }
      usedIfNotCoverage
    }
  }
`;

export default getStoreQuery;
