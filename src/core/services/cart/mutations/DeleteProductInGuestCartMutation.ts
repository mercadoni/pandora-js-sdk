import cartFragment from '../CartFragment';

const deleteProductInGuestCartMutation = `
  mutation DeleteProductInGuestCart($deleteProductInCartInput: DeleteProductInCartInput!) {
    deleteProductInGuestCart(deleteProductInCartInput: $deleteProductInCartInput) {
      ${cartFragment}
    }
  }
`;

export default deleteProductInGuestCartMutation;
