import cartFragment from '../CartFragment';

const deleteCartMutation = `
  mutation DeleteEcommerceCart($cartId: ID!) {
    deleteEcommerceCart(cartId: $cartId) {
      ${cartFragment}
    }
  }
`;

export default deleteCartMutation;
