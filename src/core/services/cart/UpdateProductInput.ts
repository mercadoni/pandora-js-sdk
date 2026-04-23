import Input from '../../models/Input';

class UpdateProductInput extends Input {
    constructor(config: {
        cartId: string;
        productId: string;
        unit?: string;
        unitQuantity?: number;
        variant?: string;
        instruction?: string;
        substitutes?: {
            substituteMode?: string;
            substituteProducts: Array<string>;
        };
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['productId'] = config.productId;
        if (config.unit !== undefined) this.query['unit'] = config.unit;
        if (config.unitQuantity !== undefined) this.query['unitQuantity'] = config.unitQuantity;
        if (config.variant !== undefined) this.query['variant'] = config.variant;
        if (config.instruction !== undefined) this.query['instruction'] = config.instruction;
        if (config.substitutes) this.query['substitutes'] = config.substitutes;
    }
}

export default UpdateProductInput;
