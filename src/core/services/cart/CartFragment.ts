import cartProductFields from './fields/CartProductFields';
import specialProductFields from './fields/SpecialProductFields';
import pricesSummaryFields from './fields/PricesSummaryFields';

const cartFragment = `
  id
  operationalModel
  status
  paymentConfigurationId
  products {
    ${cartProductFields}
  }
  specialProducts {
    ${specialProductFields}
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
    ${pricesSummaryFields}
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
