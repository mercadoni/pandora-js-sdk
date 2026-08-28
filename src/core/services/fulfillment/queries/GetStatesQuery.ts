const getStatesQuery = `
  query GetStates(
    $coverageFilters: CoverageFilterStateInput
    $uncoveredFilters: UncoveredFiltersStateInput
    $storeReferences: [String!]
  ) {
    getStates(
      coverageFilters: $coverageFilters
      uncoveredFilters: $uncoveredFilters
      storeReferences: $storeReferences
    ) {
      id active name
    }
  }
`;

export default getStatesQuery;
