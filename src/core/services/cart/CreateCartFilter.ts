import Filter from '../../models/Filter';

class CreateCartFilter extends Filter {
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

export default CreateCartFilter;
