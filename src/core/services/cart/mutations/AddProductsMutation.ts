import cartFragment from '../CartFragment';

const addProductsMutation = `
  mutation AddProductsToEcommerceCart($addProductsToCartInput: AddProductsToCartInput!) {
    addProductsToEcommerceCart(addProductsToCartInput: $addProductsToCartInput) {
      cart {
        ${cartFragment}
      }
      confirmationStatuses {
        reference
        validationIssues {
          reason
          type
          productId
        }
      }
    }
  }
`;

export default addProductsMutation;
