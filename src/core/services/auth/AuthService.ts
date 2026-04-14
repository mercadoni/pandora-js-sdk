import SignInFilter from './SignInFilter';
import SignUpFilter from './SignUpFilter';
import RefreshTokensFilter from './RefreshTokensFilter';
import ForgotPasswordFilter from './ForgotPasswordFilter';
import SignInResponse from '../../models/auth/SignInResponse';
import SignUpResponse from '../../models/auth/SignUpResponse';
import RefreshTokensResponse from '../../models/auth/RefreshTokensResponse';

interface AuthService {
    signIn(filter: SignInFilter): Promise<SignInResponse>;
    signUp(filter: SignUpFilter): Promise<SignUpResponse>;
    refreshTokens(filter: RefreshTokensFilter): Promise<RefreshTokensResponse>;
    logout(): Promise<boolean>;
    forgotPassword(filter: ForgotPasswordFilter): Promise<boolean>;
}

export default AuthService;
