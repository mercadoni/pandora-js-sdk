const getStoresNearbyQuery = `
  query GetStoresNearbyByCoords(
    $clientId: String!
    $operationalModel: OperationModel!
    $coordinates: Coords!
    $filter: LocationFilter
  ) {
    getStoresNearbyByCoords(
      clientId: $clientId
      operationalModel: $operationalModel
      coordinates: $coordinates
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

export default getStoresNearbyQuery;
