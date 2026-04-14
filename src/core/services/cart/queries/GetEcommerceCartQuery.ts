import cartFragment from '../CartFragment';

const getEcommerceCartQuery = `
  query GetEcommerceCart($cartId: ID!) {
    getEcommerceCart(cartId: $cartId) {
      ${cartFragment}
    }
  }
`;

export default getEcommerceCartQuery;
