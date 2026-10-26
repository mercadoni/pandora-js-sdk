const pricesSummaryFields = `
  shippingFee
  taxes
  discounts
  subtotal
  total
  totalBeforeTaxes
  fullPrice
  productsSummary {
    productsTotal
    fullProductsPrice
    totalProductsDiscount
    missingForMinimumOrderValue
    missingForFreeShipping
    isApplicableForFreeShipping
    productsTotalBeforeTaxes
    fullProductsPriceBeforeTaxes
    totalProductsDiscountBeforeTaxes
    missingForMinimumOrderValueBeforeTaxes
    missingForFreeShippingBeforeTaxes
  }
`;

export default pricesSummaryFields;
