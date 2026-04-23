import Input from '../../models/Input';

class CreateGuestCartInput extends Input {
    constructor(config: {
        storeReference: string;
        operationalModel: string;
        clientId: string;
    }) {
        super();
        this.query['storeReference'] = config.storeReference;
        this.query['operationalModel'] = config.operationalModel;
        this.query['clientId'] = config.clientId;
    }
}

export default CreateGuestCartInput;
