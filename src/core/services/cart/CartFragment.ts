const PRICE_FIELDS = `
  taxes
  subtotal
  fullPrice
  discount
  total
  totalBeforeTaxes
`;

const CART_PRODUCT_FIELDS = `
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
`;

const cartFragment = `
  id
  operationalModel
  status
  paymentConfigurationId
  products {
    ${CART_PRODUCT_FIELDS}
  }
  specialProducts {
    id
    unitQuantity
    unit
    instruction
    imageUrl
    sku
    name
    status
    price {
      ${PRICE_FIELDS}
    }
  }
  customer {
    id
    name
    email
    phoneNumber
  }
  store {
    id
    name
    reference
    currency
    address
  }
  address {
    id
    description
    latitude
    longitude
    city
    state
    zipCode
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
  coupon {
    id
    code
    benefits {
      type
      value
    }
  }
  deliverySlot {
    id
    from
    to
    expiresAt
    type
  }
  validationIssues {
    reason
    type
    productId
  }
`;

export default cartFragment;
