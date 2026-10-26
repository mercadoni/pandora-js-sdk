const expressDeliveryAreaDetailsQuery = `
  query ExpressDeliveryAreaDetails(
    $expressDeliveryAreaDetailsInput: ExpressDeliveryAreaDetailsInput!
  ) {
    expressDeliveryAreaDetails(
      expressDeliveryAreaDetailsInput: $expressDeliveryAreaDetailsInput
    ) {
      available
    }
  }
`;

export default expressDeliveryAreaDetailsQuery;
