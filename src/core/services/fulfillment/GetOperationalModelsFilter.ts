import Input from '../../models/Input';

class GetOperationalModelsFilter extends Input {
    constructor(config: {
        clientId: string;
    }) {
        super();
        this.query['clientId'] = config.clientId;
    }
}

export default GetOperationalModelsFilter;
