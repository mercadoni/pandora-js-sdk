const getStoreByReferenceQuery = `
  query GetStoreIdByStoreReference($storeReference: String!) {
    getStoreIdByStoreReference(storeReference: $storeReference) {
      id name code phone state
      cities { name }
      address country operationModel
      serviceFee { PICK_AND_COLLECT DELIVERY }
      usedIfNotCoverage
    }
  }
`;

export default getStoreByReferenceQuery;
