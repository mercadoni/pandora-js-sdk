import cartProductFields from './CartProductFields';

// isSample and clickMultiplier exist only on ValidatedCartProductModel, not on the plain cart line
const validatedCartProductFields = `
  ${cartProductFields}
  isSample
  clickMultiplier
`;

export default validatedCartProductFields;
