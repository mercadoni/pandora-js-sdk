const PRICE_FIELDS = `
  taxes
  subtotal
  fullPrice
  discount
  total
  totalBeforeTaxes
`;

const validateGuestCartFragment = `
  id
  operationalModel
  status
  products {
    id
    unitQuantity
    baseUnitPrice
    baseUnitPriceBeforeTaxes
    reference
    unit
    variant
    instruction
    status
    imageUrl
    name
    availability
    baseUnit
    stockWarning
    maxUnitQuantity
    minUnitQuantity
    price {
      ${PRICE_FIELDS}
    }
    substitutes {
      substituteMode
      substituteProducts
    }
  }
  store {
    id
    name
    reference
    currency
  }
  pricesSummary {
    shippingFee
    taxes
    discounts
    subtotal
    total
    totalBeforeTaxes
    fullPrice
  }
  storeConfiguration {
    minimumPurchasingAmount
    maximumPurchasingAmount
    serviceFee
    minimumToFreeServiceFee
    isCurbsidePickupEnabled
  }
  validationIssues {
    reason
    type
    productId
  }
`;

export default validateGuestCartFragment;
