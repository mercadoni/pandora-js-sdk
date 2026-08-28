const getCitiesQuery = `
  query GetCities(
    $coverageFilters: CoverageFilterCityInput
    $uncoveredFilters: UncoveredFiltersCityInput
  ) {
    getCities(
      coverageFilters: $coverageFilters
      uncoveredFilters: $uncoveredFilters
    ) {
      id name code timeZone
    }
  }
`;

export default getCitiesQuery;
