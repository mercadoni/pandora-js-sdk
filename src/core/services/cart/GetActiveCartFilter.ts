import Input from '../../models/Input';

class GetActiveCartFilter extends Input {
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
