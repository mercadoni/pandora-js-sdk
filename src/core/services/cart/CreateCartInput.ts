import Input from '../../models/Input';

class CreateCartInput extends Input {
    constructor(config: {
        storeReference: string;
        operationalModel: string;
        addressId?: string;
    }) {
        super();
        this.query['storeReference'] = config.storeReference;
        this.query['operationalModel'] = config.operationalModel;
        if (config.addressId) this.query['addressId'] = config.addressId;
    }
}

export default CreateCartInput;
