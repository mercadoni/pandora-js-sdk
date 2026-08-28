const getPCStoresByClientQuery = `
  query GetPCStoresByClient(
    $clientId: String!
    $filter: LocationFilter
    $storeReferences: [String!]
  ) {
    getPCStoresByClient(
      clientId: $clientId
      filter: $filter
      storeReferences: $storeReferences
    ) {
      id name code phone state
      cities { name }
      address country operationModel
      serviceFee { PICK_AND_COLLECT DELIVERY }
      usedIfNotCoverage
    }
  }
`;

export default getPCStoresByClientQuery;
