const purchaseCartMutation = `
  mutation PurchaseEcommerceCart($purchaseCartInput: PurchaseCartInput!) {
    purchaseEcommerceCart(purchaseCartInput: $purchaseCartInput) {
      id
      status
      jobId
      jobNumber
      lobbyScreenToken
      jobExtenalId
      purchaseDetails {
        id
        jobId
        jobNumber
        deliverySlot {
          id
          from
          to
          expiresAt
        }
      }
    }
  }
`;

export default purchaseCartMutation;
