import Filter from '../../models/Filter';

class CreateGuestCartFilter extends Filter {
    constructor(config: {
        storeReference: string;
        operationalModel: string;
        clientId: string;
    }) {
        super();
        this.query['storeReference'] = config.storeReference;
        this.query['operationalModel'] = config.operationalModel;
        this.query['clientId'] = config.clientId;
    }
}

export default CreateGuestCartFilter;
