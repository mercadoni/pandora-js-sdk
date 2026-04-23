import Input from '../../models/Input';

class SignUpInput extends Input {
    constructor(config: {
        clientId: string;
        customerData: {
            name: string;
            email: string;
            password: string;
            firstName?: string;
            lastName?: string;
            phoneNumber?: string;
            terms?: boolean;
            notifications?: boolean;
        };
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['customerData'] = config.customerData;
    }
}

export default SignUpInput;
