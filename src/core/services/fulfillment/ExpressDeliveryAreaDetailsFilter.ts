import Input from '../../models/Input';

class ExpressDeliveryAreaDetailsFilter extends Input {
    constructor(config: {
        clientId: string;
        storeReference: string;
        coordinates: { latitude: number; longitude: number };
    }) {
        super();
        this.query['clientId'] = config.clientId;
        this.query['storeReference'] = config.storeReference;
        this.query['coordinates'] = config.coordinates;
    }
}

export default ExpressDeliveryAreaDetailsFilter;
