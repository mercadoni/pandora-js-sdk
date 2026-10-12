const upsertAddressMutation = `
  mutation UpsertAddress($upsertAddressInput: UpsertAddressInput!) {
    upsertAddress(upsertAddressInput: $upsertAddressInput) {
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

export default upsertAddressMutation;
