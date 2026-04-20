import cartFragment from '../CartFragment';

const convertGuestToEcommerceCartMutation = `
  mutation ConvertGuestToEcommerceCart($cartId: ID!) {
    convertGuestToEcommerceCart(cartId: $cartId) {
      ${cartFragment}
    }
  }
`;

export default convertGuestToEcommerceCartMutation;
