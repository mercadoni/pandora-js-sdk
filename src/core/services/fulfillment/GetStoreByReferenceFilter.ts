import Input from '../../models/Input';

class GetStoreByReferenceFilter extends Input {
    constructor(config: { storeReference: string }) {
        super();
        this.query['storeReference'] = config.storeReference;
    }
}

export default GetStoreByReferenceFilter;
