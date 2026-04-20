import cartFragment from '../CartFragment';

const validateGuestCartMutation = `
  mutation ValidateGuestCart($cartId: ID!) {
    validateGuestCart(cartId: $cartId) {
      ${cartFragment}
    }
  }
`;

export default validateGuestCartMutation;
