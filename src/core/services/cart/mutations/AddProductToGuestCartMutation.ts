import cartFragment from '../CartFragment';

const addProductToGuestCartMutation = `
  mutation AddProductToGuestCart($addProductToCartInput: AddProductToCartInput!) {
    addProductToGuestCart(addProductToCartInput: $addProductToCartInput) {
      ${cartFragment}
    }
  }
`;

export default addProductToGuestCartMutation;
