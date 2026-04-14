import cartFragment from '../CartFragment';

const updateCouponMutation = `
  mutation UpdateCouponInEcommerceCart($updateCouponInput: CouponInput!) {
    updateCouponInEcommerceCart(updateCouponInput: $updateCouponInput) {
      ${cartFragment}
    }
  }
`;

export default updateCouponMutation;
