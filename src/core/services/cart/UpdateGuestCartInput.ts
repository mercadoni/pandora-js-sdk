import Input from '../../models/Input';

class UpdateGuestCartInput extends Input {
    constructor(config: {
        cartId: string;
        storeReference?: string;
        operationalModel?: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        if (config.storeReference) this.query['storeReference'] = config.storeReference;
        if (config.operationalModel) this.query['operationalModel'] = config.operationalModel;
    }
}

export default UpdateGuestCartInput;
