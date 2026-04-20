import Filter from '../../models/Filter';

class DeleteProductInGuestCartFilter extends Filter {
    constructor(config: {
        cartId: string;
        productId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['productId'] = config.productId;
    }
}

export default DeleteProductInGuestCartFilter;
