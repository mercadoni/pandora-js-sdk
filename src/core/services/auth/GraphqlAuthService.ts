import AuthService from './AuthService';
import GraphqlClient from '../../http/GraphqlClient';
import SignInFilter from './SignInFilter';
import SignUpFilter from './SignUpFilter';
import RefreshTokensFilter from './RefreshTokensFilter';
import ForgotPasswordFilter from './ForgotPasswordFilter';
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

    async signIn(filter: SignInFilter): Promise<SignInResponse> {
        const response = await this.client.mutation(signInMutation, { signInInput: filter.query });
        if (response.data?.signIn) {
            return SignInResponse.fromJson(response.data.signIn);
        }
        throw new Error(`Sign in failed: ${JSON.stringify(response.errors || response)}`);
    }

    async signUp(filter: SignUpFilter): Promise<SignUpResponse> {
        const response = await this.client.mutation(signUpMutation, { signUpInput: filter.query });
        if (response.data?.signUp) {
            return SignUpResponse.fromJson(response.data.signUp);
        }
        throw new Error(`Sign up failed: ${JSON.stringify(response.errors || response)}`);
    }

    async refreshTokens(filter: RefreshTokensFilter): Promise<RefreshTokensResponse> {
        const response = await this.client.mutation(refreshTokensMutation, { refreshTokensInput: filter.query });
        if (response.data?.refreshTokens) {
            return RefreshTokensResponse.fromJson(response.data.refreshTokens);
        }
        throw new Error(`Token refresh failed: ${JSON.stringify(response.errors || response)}`);
    }

    async logout(): Promise<boolean> {
        const response = await this.client.mutation(logoutMutation, {});
        return response.data?.logout?.success || false;
    }

    async forgotPassword(filter: ForgotPasswordFilter): Promise<boolean> {
        const response = await this.client.mutation(forgotPasswordMutation, { forgotPasswordInput: filter.query });
        return response.data?.forgotPassword?.success || false;
    }
}

export default GraphqlAuthService;
