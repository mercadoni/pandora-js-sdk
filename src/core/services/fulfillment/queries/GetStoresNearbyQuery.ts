const getStoresNearbyQuery = `
  query GetStoresNearbyByCoords(
    $clientId: String!
    $operationalModel: OperationModel!
    $coordinates: Coords!
  ) {
    getStoresNearbyByCoords(
      clientId: $clientId
      operationalModel: $operationalModel
      coordinates: $coordinates
    ) {
      id name code phone state
      cities { name }
      address country dynamicParams operationModel
      serviceFee { PICK_AND_COLLECT DELIVERY }
      usedIfNotCoverage
    }
  }
`;

export default getStoresNearbyQuery;
