import Input from '../../models/Input';

class RefreshTokensInput extends Input {
    constructor(config: {
        refreshToken: string;
    }) {
        super();
        this.query['refreshToken'] = config.refreshToken;
    }
}

export default RefreshTokensInput;
