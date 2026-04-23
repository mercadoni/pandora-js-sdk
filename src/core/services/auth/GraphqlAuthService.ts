import AuthService from './AuthService';
import GraphqlClient from '../../http/GraphqlClient';
import SignInInput from './SignInInput';
import SignUpInput from './SignUpInput';
import RefreshTokensInput from './RefreshTokensInput';
import ForgotPasswordInput from './ForgotPasswordInput';
import SignInResponse from '../../models/auth/SignInResponse';
import SignUpResponse from '../../models/auth/SignUpResponse';
import RefreshTokensResponse from '../../models/auth/RefreshTokensResponse';
import signInMutation from './mutations/SignInMutation';
import signUpMutation from './mutations/SignUpMutation';
import refreshTokensMutation from './mutations/RefreshTokensMutation';
import logoutMutation from './mutations/LogoutMutation';
import forgotPasswordMutation from './mutations/ForgotPasswordMutation';

class GraphqlAuthService implements AuthService {

    constructor(private readonly client: GraphqlClient) {}

    async signIn(input: SignInInput): Promise<SignInResponse> {
        const response = await this.client.mutation(signInMutation, { signInInput: input.query });
        if (response.data?.signIn) {
            return SignInResponse.fromJson(response.data.signIn);
        }
        throw new Error(`Sign in failed: ${JSON.stringify(response.errors || response)}`);
    }

    async signUp(input: SignUpInput): Promise<SignUpResponse> {
        const response = await this.client.mutation(signUpMutation, { signUpInput: input.query });
        if (response.data?.signUp) {
            return SignUpResponse.fromJson(response.data.signUp);
        }
        throw new Error(`Sign up failed: ${JSON.stringify(response.errors || response)}`);
    }

    async refreshTokens(input: RefreshTokensInput): Promise<RefreshTokensResponse> {
        const response = await this.client.mutation(refreshTokensMutation, { refreshTokensInput: input.query });
        if (response.data?.refreshTokens) {
            return RefreshTokensResponse.fromJson(response.data.refreshTokens);
        }
        throw new Error(`Token refresh failed: ${JSON.stringify(response.errors || response)}`);
    }

    async logout(): Promise<boolean> {
        const response = await this.client.mutation(logoutMutation, {});
        if (response.data?.logout === undefined) {
            throw new Error('Logout failed: unexpected response from server');
        }
        return response.data.logout?.success ?? false;
    }

    async forgotPassword(input: ForgotPasswordInput): Promise<boolean> {
        const response = await this.client.mutation(forgotPasswordMutation, { forgotPasswordInput: input.query });
        if (response.data?.forgotPassword === undefined) {
            throw new Error('Forgot password failed: unexpected response from server');
        }
        return response.data.forgotPassword?.success ?? false;
    }
}

export default GraphqlAuthService;
