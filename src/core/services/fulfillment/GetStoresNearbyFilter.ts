import Input from '../../models/Input';
import LocationFilter from './LocationFilter';
import OperationalModel from './OperationalModel';

class GetStoresNearbyFilter extends Input {
    constructor(config: {
        clientId: string;
        operationalModel: OperationalModel;
        coordinates: { latitude: number; longitude: number };
        filter?: LocationFilter;
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['operationalModel'] = config.operationalModel;
        this.query['coordinates'] = config.coordinates;
        if (config.filter !== undefined) this.query['filter'] = config.filter;
    }
}

export default GetStoresNearbyFilter;
