import AuthCustomer from './AuthCustomer';

class SignUpResponse {
    customer: AuthCustomer;
    token: string;
    refreshToken: string;

    constructor(config: {
        customer: AuthCustomer;
        token: string;
        refreshToken: string;
    }) {
        this.customer = config.customer;
        this.token = config.token;
        this.refreshToken = config.refreshToken;
    }

    static fromJson(json: Record<string, any>): SignUpResponse {
        return new SignUpResponse({
            customer: AuthCustomer.fromJson(json.customer),
            token: json.token || '',
            refreshToken: json.refreshToken || '',
        });
    }
}

export default SignUpResponse;
