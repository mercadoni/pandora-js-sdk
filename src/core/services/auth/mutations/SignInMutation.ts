const signInMutation = `
  mutation SignIn($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput) {
      token
      refreshToken
      mfa {
        sessionId
      }
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

export default signInMutation;
