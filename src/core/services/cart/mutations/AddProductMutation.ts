import cartFragment from '../CartFragment';

const addProductMutation = `
  mutation AddProductToEcommerceCart($addProductToCartInput: AddProductToCartInput!) {
    addProductToEcommerceCart(addProductToCartInput: $addProductToCartInput) {
      ${cartFragment}
    }
  }
`;

export default addProductMutation;
