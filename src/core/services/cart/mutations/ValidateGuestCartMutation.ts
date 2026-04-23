import validateGuestCartFragment from '../ValidateGuestCartFragment';

const validateGuestCartMutation = `
  mutation ValidateGuestCart($cartId: ID!) {
    validateGuestCart(cartId: $cartId) {
      ${validateGuestCartFragment}
    }
  }
`;

export default validateGuestCartMutation;
