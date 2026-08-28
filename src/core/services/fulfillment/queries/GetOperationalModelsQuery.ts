const getOperationalModelsQuery = `
  query GetOperationalModelByClient($clientId: String!) {
    getOperationalModelByClient(clientId: $clientId) {
      operationalModels
    }
  }
`;

export default getOperationalModelsQuery;
