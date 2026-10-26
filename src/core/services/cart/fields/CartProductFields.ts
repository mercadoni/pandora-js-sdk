import priceFields from './PriceFields';

const cartProductFields = `
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
  type
  createdAt
  price {
    ${priceFields}
  }
  substitutes {
    substituteMode
    substituteProducts
  }
`;

export default cartProductFields;
