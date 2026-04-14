import AuthCustomer from './AuthCustomer';

class SignInResponse {
    token: string | null;
    refreshToken: string | null;
    customer: AuthCustomer | null;
    mfa: { sessionId: string } | null;

    constructor(config: {
        token?: string | null;
        refreshToken?: string | null;
        customer?: AuthCustomer | null;
        mfa?: { sessionId: string } | null;
    }) {
        this.token = config.token || null;
        this.refreshToken = config.refreshToken || null;
        this.customer = config.customer || null;
        this.mfa = config.mfa || null;
    }

    static fromJson(json: Record<string, any>): SignInResponse {
        return new SignInResponse({
            token: json.token,
            refreshToken: json.refreshToken,
            customer: json.customer ? AuthCustomer.fromJson(json.customer) : null,
            mfa: json.mfa || null,
        });
    }
}

export default SignInResponse;
