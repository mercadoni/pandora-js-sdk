import Filter from '../../models/Filter';

class AddProductsFilter extends Filter {
    constructor(config: {
        cartId: string;
        products: Array<{
            reference: string;
            unit: string;
            unitQuantity: number;
            variant?: string;
            instruction?: string;
        }>;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['products'] = config.products;
    }
}

export default AddProductsFilter;
