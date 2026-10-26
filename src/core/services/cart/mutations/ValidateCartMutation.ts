import validateCartFragment from '../ValidateCartFragment';

const validateCartMutation = `
  mutation ValidateEcommerceCart($cartId: ID!, $allowSplitOrders: Boolean) {
    validateEcommerceCart(cartId: $cartId, allowSplitOrders: $allowSplitOrders) {
      ${validateCartFragment}
      groups {
        id
        isBigOrder
        operationalModel
        pricesSummary {
          shippingFee
          taxes
          discounts
          subtotal
          total
          totalBeforeTaxes
          fullPrice
        }
        products {
          id
          reference
          unitQuantity
          name
          unit
          status
        }
      }
      loyalty {
        availablePoints {
          points
          conversionRate
          conversionValue
        }
        redeemable {
          points
          conversionRate
          conversionValue
        }
        selectedRedemption {
          points
          conversionRate
          conversionValue
        }
      }
    }
  }
`;

export default validateCartMutation;
