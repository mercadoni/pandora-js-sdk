import Input from '../../models/Input';

class DeleteProductInGuestCartInput extends Input {
    constructor(config: {
        cartId: string;
        productId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['productId'] = config.productId;
    }
}

export default DeleteProductInGuestCartInput;
