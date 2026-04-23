import Input from '../../models/Input';

class AddProductsInput extends Input {
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

export default AddProductsInput;
