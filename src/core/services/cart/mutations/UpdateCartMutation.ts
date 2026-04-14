import cartFragment from '../CartFragment';

const updateCartMutation = `
  mutation UpdateEcommerceCart($updateCartInput: UpdateEcommerceCartInput!) {
    updateEcommerceCart(updateCartInput: $updateCartInput) {
      ${cartFragment}
    }
  }
`;

export default updateCartMutation;
