import priceFields from './PriceFields';

const specialProductFields = `
  id
  unitQuantity
  unit
  instruction
  imageUrl
  sku
  name
  status
  createdAt
  price {
    ${priceFields}
  }
`;

export default specialProductFields;
