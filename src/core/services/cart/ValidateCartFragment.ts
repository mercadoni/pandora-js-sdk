import validatedCartProductFields from './fields/ValidatedCartProductFields';
import specialProductFields from './fields/SpecialProductFields';
import pricesSummaryFields from './fields/PricesSummaryFields';
import validationIssueFields from './fields/ValidationIssueFields';

// ValidatedCartModel has no deliverySlot, so this cannot reuse cartFragment
const validateCartFragment = `
  id
  operationalModel
  status
  paymentConfigurationId
  products {
    ${validatedCartProductFields}
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
    address {
      other
    }
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
  validationIssues {
    ${validationIssueFields}
  }
`;

export default validateCartFragment;
