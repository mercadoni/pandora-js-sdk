import Input from '../../models/Input';
import OperationalModel from './OperationalModel';

class GetStoresNearbyFilter extends Input {
    constructor(config: {
        clientId: string;
        operationalModel: OperationalModel;
        coordinates: { latitude: number; longitude: number };
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['operationalModel'] = config.operationalModel;
        this.query['coordinates'] = config.coordinates;
    }
}

export default GetStoresNearbyFilter;
