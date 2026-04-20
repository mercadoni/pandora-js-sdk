import cartFragment from '../CartFragment';

const createGuestCartMutation = `
  mutation CreateGuestCart($createCartInput: CreateGuestCartInput!) {
    createGuestCart(createCartInput: $createCartInput) {
      ${cartFragment}
    }
  }
`;

export default createGuestCartMutation;
