import Input from '../../models/Input';

class GetStatesFilter extends Input {
    constructor(config: {
        clientId: string;
        operationalModel: string;
    }) {
        super();
        this.query['coverageFilters'] = {
            clientId: config.clientId,
            operationalModel: config.operationalModel,
        };
    }
}

export default GetStatesFilter;
