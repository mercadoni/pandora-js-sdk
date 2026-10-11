const getStoresNearbyByAddressQuery = `
  query GetStoresNearbyByAddress(
    $addressId: ID!
    $operationalModel: OperationModel
    $clientId: String!
    $storeReferences: [String!]
  ) {
    getStoresNearbyByAddress(
      addressId: $addressId
      operationalModel: $operationalModel
      clientId: $clientId
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

export default getStoresNearbyByAddressQuery;
