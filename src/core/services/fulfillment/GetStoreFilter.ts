import Input from '../../models/Input';

class GetStoreFilter extends Input {
    constructor(config: {
        storeId?: string;
        clientId?: string;
    }) {
        super();
        if (config.storeId !== undefined) this.query['storeId'] = config.storeId;
        if (config.clientId !== undefined) this.query['clientId'] = config.clientId;
    }
}

export default GetStoreFilter;
