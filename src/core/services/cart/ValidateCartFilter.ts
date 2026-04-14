import Filter from '../../models/Filter';

class ValidateCartFilter extends Filter {
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

export default ValidateCartFilter;
