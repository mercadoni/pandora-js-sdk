import cartFragment from '../CartFragment';

const updateProductMutation = `
  mutation UpdateProductInEcommerceCart($updateProductInCartInput: UpdateProductInCartInput!) {
    updateProductInEcommerceCart(updateProductInCartInput: $updateProductInCartInput) {
      ${cartFragment}
    }
  }
`;

export default updateProductMutation;
