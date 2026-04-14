const signUpMutation = `
  mutation SignUp($signUpInput: SignUpInput!) {
    signUp(signUpInput: $signUpInput) {
      token
      refreshToken
      customer {
        id
        name
        firstName
        lastName
        email
        phoneNumber
        documentId
        documentType
        uid
        terms
        notifications
      }
    }
  }
`;

export default signUpMutation;
