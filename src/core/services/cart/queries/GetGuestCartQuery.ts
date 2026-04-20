import cartFragment from '../CartFragment';

const getGuestCartQuery = `
  query GetGuestCart($cartId: ID!) {
    getGuestCart(cartId: $cartId) {
      ${cartFragment}
    }
  }
`;

export default getGuestCartQuery;
