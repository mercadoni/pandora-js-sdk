import cartFragment from '../CartFragment';

const getOrCreateCartMutation = `
  mutation GetActiveOrCreateEcommerceCart($createCartInput: CreateEcommerceCartInput!) {
    getActiveOrCreateEcommerceCart(createCartInput: $createCartInput) {
      ${cartFragment}
    }
  }
`;

export default getOrCreateCartMutation;
