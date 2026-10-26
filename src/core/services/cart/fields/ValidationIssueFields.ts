// metadata is selected on validation answers only; the shared cart selection omits it
const validationIssueFields = `
  reason
  type
  productId
  metadata {
    minUnitQuantity
    maxUnitQuantity
    clickMultiplier
    suggestedUnit
  }
`;

export default validationIssueFields;
