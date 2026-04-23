import Input from '../../models/Input';

class GetGuestCartFilter extends Input {
    constructor(config: {
        cartId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
    }
}

export default GetGuestCartFilter;
