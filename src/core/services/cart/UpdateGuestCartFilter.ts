import Filter from '../../models/Filter';

class UpdateGuestCartFilter extends Filter {
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

export default UpdateGuestCartFilter;
