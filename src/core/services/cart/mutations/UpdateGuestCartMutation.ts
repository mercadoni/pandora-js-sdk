import cartFragment from '../CartFragment';

const updateGuestCartMutation = `
  mutation UpdateGuestCart($updateCartInput: UpdateGuestCartInput!) {
    updateGuestCart(updateCartInput: $updateCartInput) {
      ${cartFragment}
    }
  }
`;

export default updateGuestCartMutation;
