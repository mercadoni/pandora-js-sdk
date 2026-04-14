const refreshTokensMutation = `
  mutation RefreshTokens($refreshTokensInput: RefreshTokensInput!) {
    refreshTokens(refreshTokensInput: $refreshTokensInput) {
      token
      refreshToken
    }
  }
`;

export default refreshTokensMutation;
