import Input from '../../models/Input';

class ValidateCartInput extends Input {
    constructor(config: {
        cartId: string;
        allowSplitOrders?: boolean;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        if (config.allowSplitOrders !== undefined) {
            this.query['allowSplitOrders'] = config.allowSplitOrders;
        }
    }
}

export default ValidateCartInput;
