import Input from '../../models/Input';
import OperationalModel from './OperationalModel';

class GetStoresNearbyByAddressFilter extends Input {
    constructor(config: {
        clientId: string;
        addressId: string;
        operationalModel?: OperationalModel;
        storeReferences?: string[];
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['addressId'] = config.addressId;
        if (config.operationalModel !== undefined) this.query['operationalModel'] = config.operationalModel;
        if (config.storeReferences !== undefined) this.query['storeReferences'] = config.storeReferences;
    }
}

export default GetStoresNearbyByAddressFilter;
