import Input from '../../models/Input';
import LocationFilter from './LocationFilter';
import OperationalModel from './OperationalModel';

class GetStoresNearbyByAddressFilter extends Input {
    constructor(config: {
        clientId: string;
        addressId: string;
        operationalModel?: OperationalModel;
        storeReferences?: string[];
        filter?: LocationFilter;
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['addressId'] = config.addressId;
        if (config.operationalModel !== undefined) this.query['operationalModel'] = config.operationalModel;
        if (config.storeReferences !== undefined) this.query['storeReferences'] = config.storeReferences;
        if (config.filter !== undefined) this.query['filter'] = config.filter;
    }
}

export default GetStoresNearbyByAddressFilter;
