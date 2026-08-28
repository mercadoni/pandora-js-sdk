import Input from '../../models/Input';

class GetStoresNearbyFilter extends Input {
    constructor(config: {
        clientId: string;
        operationalModel: string;
        coordinates: { latitude: number; longitude: number };
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['operationalModel'] = config.operationalModel;
        this.query['coordinates'] = config.coordinates;
    }
}

export default GetStoresNearbyFilter;
