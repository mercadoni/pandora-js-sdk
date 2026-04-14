const forgotPasswordMutation = `
  mutation ForgotPassword($forgotPasswordInput: ForgotPasswordInput!) {
    forgotPassword(forgotPasswordInput: $forgotPasswordInput) {
      success
    }
  }
`;

export default forgotPasswordMutation;
