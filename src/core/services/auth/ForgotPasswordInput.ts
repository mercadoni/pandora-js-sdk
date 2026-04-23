import Input from '../../models/Input';

class ForgotPasswordInput extends Input {
    constructor(config: {
        clientId: string;
        email: string;
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['email'] = config.email;
    }
}

export default ForgotPasswordInput;
