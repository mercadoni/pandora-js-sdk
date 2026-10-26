import cartFragment from '../CartFragment';

const deleteSpecialProductMutation = `
  mutation DeleteSpecialProductInEcommerceCart($deleteSpecialProductInCartInput: DeleteSpecialProductInCartInput!) {
    deleteSpecialProductInEcommerceCart(deleteSpecialProductInCartInput: $deleteSpecialProductInCartInput) {
      ${cartFragment}
    }
  }
`;

export default deleteSpecialProductMutation;
