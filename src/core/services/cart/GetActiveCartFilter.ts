import Filter from '../../models/Filter';

class GetActiveCartFilter extends Filter {
    constructor(config: {
        storeReference: string;
        operationalModel: string;
    }) {
        super();
        this.query['storeReference'] = config.storeReference;
        this.query['operationalModel'] = config.operationalModel;
    }
}

export default GetActiveCartFilter;
