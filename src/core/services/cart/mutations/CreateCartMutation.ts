import cartFragment from '../CartFragment';

const createCartMutation = `
  mutation CreateEcommerceCart($createCartInput: CreateEcommerceCartInput!) {
    createEcommerceCart(createCartInput: $createCartInput) {
      ${cartFragment}
    }
  }
`;

export default createCartMutation;
