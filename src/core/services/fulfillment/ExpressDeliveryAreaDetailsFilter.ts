import Input from '../../models/Input';

class ExpressDeliveryAreaDetailsFilter extends Input {
    constructor(config: {
        clientId: string;
        storeReference: string;
        coordinates: { latitude: number; longitude: number };
    }) {
        super();
        this.query['expressDeliveryAreaDetailsInput'] = {
            clientId: config.clientId,
            storeReference: config.storeReference,
            coordinates: config.coordinates,
        };
    }
}

export default ExpressDeliveryAreaDetailsFilter;
