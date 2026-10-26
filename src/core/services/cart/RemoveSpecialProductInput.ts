import Input from '../../models/Input';

class RemoveSpecialProductInput extends Input {
    constructor(config: {
        cartId: string;
        specialProductId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['specialProductId'] = config.specialProductId;
    }
}

export default RemoveSpecialProductInput;
