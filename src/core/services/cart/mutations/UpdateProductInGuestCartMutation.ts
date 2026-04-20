import cartFragment from '../CartFragment';

const updateProductInGuestCartMutation = `
  mutation UpdateProductInGuestCart($updateProductInCartInput: UpdateProductInCartInput!) {
    updateProductInGuestCart(updateProductInCartInput: $updateProductInCartInput) {
      ${cartFragment}
    }
  }
`;

export default updateProductInGuestCartMutation;
