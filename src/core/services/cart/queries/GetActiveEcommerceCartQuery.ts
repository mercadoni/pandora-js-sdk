import cartFragment from '../CartFragment';

const getActiveEcommerceCartQuery = `
  query GetActiveEcommerceCart($getActiveCartInput: GetActiveEcommerceCartInput!) {
    getActiveEcommerceCart(getActiveCartInput: $getActiveCartInput) {
      ${cartFragment}
    }
  }
`;

export default getActiveEcommerceCartQuery;
