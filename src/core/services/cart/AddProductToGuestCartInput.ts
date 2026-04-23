import Input from '../../models/Input';

class AddProductToGuestCartInput extends Input {
    constructor(config: {
        cartId: string;
        reference: string;
        unit: string;
        unitQuantity: number;
        variant?: string;
        instruction?: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['reference'] = config.reference;
        this.query['unit'] = config.unit;
        this.query['unitQuantity'] = config.unitQuantity;
        if (config.variant) this.query['variant'] = config.variant;
        if (config.instruction) this.query['instruction'] = config.instruction;
    }
}

export default AddProductToGuestCartInput;
