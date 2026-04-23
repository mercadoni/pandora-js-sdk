import Input from '../../models/Input';

class SignInInput extends Input {
    constructor(config: {
        clientId: string;
        email: string;
        password: string;
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['email'] = config.email;
        this.query['password'] = config.password;
    }
}

export default SignInInput;
