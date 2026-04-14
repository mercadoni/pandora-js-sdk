import Filter from '../../models/Filter';

class ForgotPasswordFilter extends Filter {
    constructor(config: {
        clientId: string;
        email: string;
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['email'] = config.email;
    }
}

export default ForgotPasswordFilter;
