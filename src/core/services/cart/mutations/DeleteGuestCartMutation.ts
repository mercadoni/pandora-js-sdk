import cartFragment from '../CartFragment';

const deleteGuestCartMutation = `
  mutation DeleteGuestCart($cartId: ID!) {
    deleteGuestCart(cartId: $cartId) {
      ${cartFragment}
    }
  }
`;

export default deleteGuestCartMutation;
