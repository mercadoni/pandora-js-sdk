import cartFragment from '../CartFragment';

const removeProductMutation = `
  mutation DeleteProductInEcommerceCart($deleteProductInCartInput: DeleteProductInCartInput!) {
    deleteProductInEcommerceCart(deleteProductInCartInput: $deleteProductInCartInput) {
      ${cartFragment}
    }
  }
`;

export default removeProductMutation;
