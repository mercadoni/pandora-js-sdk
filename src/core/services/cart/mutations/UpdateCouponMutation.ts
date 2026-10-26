import validateCartFragment from '../ValidateCartFragment';

const updateCouponMutation = `
  mutation UpdateCouponInEcommerceCart($updateCouponInput: CouponInput!) {
    updateCouponInEcommerceCart(updateCouponInput: $updateCouponInput) {
      ${validateCartFragment}
    }
  }
`;

export default updateCouponMutation;
