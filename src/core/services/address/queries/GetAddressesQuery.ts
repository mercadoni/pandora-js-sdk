const getAddressesQuery = `
  query GetAddresses($getAddressesInput: GetAddressesInput!) {
    getAddresses(getAddressesInput: $getAddressesInput) {
      id
      description
      address {
        other
      }
      addressTwo
      available
      latitude
      longitude
      city
      state
      zipCode
      customerId
    }
  }
`;

export default getAddressesQuery;
