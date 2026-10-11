import Input from '../../models/Input';

class CreateAddressInput extends Input {
    constructor(config: {
        description: string;
        address: { other: string; structure?: unknown };
        addressTwo?: string;
        latitude: number;
        longitude: number;
        city: string;
        state?: string;
        zipCode?: string;
        /** Must be a store that covers the address coordinates; the backend rejects the request otherwise. */
        storeReference: string;
        /** Same rule as `GetAddressesFilter.customerId`: omit with a customer token; required with an agent token. */
        customerId?: string;
    }) {
        super();
        this.query['upsertAddressInput'] = {
            description: config.description,
            address: {
                other: config.address.other,
                ...(config.address.structure !== undefined && { structure: config.address.structure }),
            },
            addressTwo: config.addressTwo ?? '',
            latitude: config.latitude,
            longitude: config.longitude,
            city: config.city,
            storeReference: config.storeReference,
            ...(config.state !== undefined && { state: config.state }),
            ...(config.zipCode !== undefined && { zipCode: config.zipCode }),
            ...(config.customerId !== undefined && { customerId: config.customerId }),
        };
    }
}

export default CreateAddressInput;
