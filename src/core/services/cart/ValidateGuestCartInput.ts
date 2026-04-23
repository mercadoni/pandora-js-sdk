import Input from '../../models/Input';

class ValidateGuestCartInput extends Input {
    constructor(config: {
        cartId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
    }
}

export default ValidateGuestCartInput;
