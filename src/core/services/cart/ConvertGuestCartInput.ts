import Input from '../../models/Input';

class ConvertGuestCartInput extends Input {
    constructor(config: {
        cartId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
    }
}

export default ConvertGuestCartInput;
