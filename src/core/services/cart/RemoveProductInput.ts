import Input from '../../models/Input';

class RemoveProductInput extends Input {
    constructor(config: {
        cartId: string;
        productId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['productId'] = config.productId;
    }
}

export default RemoveProductInput;
