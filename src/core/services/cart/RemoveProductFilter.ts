import Filter from '../../models/Filter';

class RemoveProductFilter extends Filter {
    constructor(config: {
        cartId: string;
        productId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['productId'] = config.productId;
    }
}

export default RemoveProductFilter;
