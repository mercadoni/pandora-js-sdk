const getAddressesQuery = `
  query GetAddresses($getAddressesInput: GetAddressesInput!) {
    getAddresses(getAddressesInput: $getAddressesInput) {
      id
      description
      address {
        other
        structure
      }
      addressTwo
      available
      latitude
      longitude
      city
      state
      zipCode
      removed
      customerId
      distanceToStore
    }
  }
`;

export default getAddressesQuery;
