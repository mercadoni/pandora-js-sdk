const getStoresNearbyByAddressQuery = `
  query GetStoresNearbyByAddress(
    $addressId: ID!
    $operationalModel: OperationModel
    $clientId: String!
    $storeReferences: [String!]
    $filter: LocationFilter
  ) {
    getStoresNearbyByAddress(
      addressId: $addressId
      operationalModel: $operationalModel
      clientId: $clientId
      storeReferences: $storeReferences
      filter: $filter
    ) {
      id name code phone state
      cities { name }
      address country operationModel
      serviceFee { PICK_AND_COLLECT DELIVERY }
      usedIfNotCoverage
      sphereDistance dynamicParams
    }
  }
`;

export default getStoresNearbyByAddressQuery;
