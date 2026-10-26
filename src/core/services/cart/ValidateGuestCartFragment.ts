import validatedCartProductFields from './fields/ValidatedCartProductFields';
import pricesSummaryFields from './fields/PricesSummaryFields';
import validationIssueFields from './fields/ValidationIssueFields';

const validateGuestCartFragment = `
  id
  operationalModel
  status
  products {
    ${validatedCartProductFields}
  }
  store {
    id
    name
    reference
    currency
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
  validationIssues {
    ${validationIssueFields}
  }
`;

export default validateGuestCartFragment;
