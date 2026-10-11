import Input from '../../models/Input';

class GetAddressesFilter extends Input {
    constructor(config: {
        storeReference: string;
        /** Omit with a customer token; required with an agent token. */
        customerId?: string;
        pageSize?: number;
        currentPage?: number;
    }) {
        super();
        this.query['getAddressesInput'] = {
            storeReference: config.storeReference,
            ...(config.customerId != null && { customerId: config.customerId }),
            ...(config.pageSize != null && { pageSize: config.pageSize }),
            ...(config.currentPage != null && { currentPage: config.currentPage }),
        };
    }
}

export default GetAddressesFilter;
