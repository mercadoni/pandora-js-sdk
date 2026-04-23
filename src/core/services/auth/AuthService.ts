import SignInInput from './SignInInput';
import SignUpInput from './SignUpInput';
import RefreshTokensInput from './RefreshTokensInput';
import ForgotPasswordInput from './ForgotPasswordInput';
import SignInResponse from '../../models/auth/SignInResponse';
import SignUpResponse from '../../models/auth/SignUpResponse';
import RefreshTokensResponse from '../../models/auth/RefreshTokensResponse';

interface AuthService {
    signIn(input: SignInInput): Promise<SignInResponse>;
    signUp(input: SignUpInput): Promise<SignUpResponse>;
    refreshTokens(input: RefreshTokensInput): Promise<RefreshTokensResponse>;
    logout(): Promise<boolean>;
    forgotPassword(input: ForgotPasswordInput): Promise<boolean>;
}

export default AuthService;
