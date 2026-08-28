import Input from '../../models/Input';

class GetCitiesFilter extends Input {
    constructor(config: {
        clientId: string;
        operationalModel: string;
        stateName: string;
    }) {
        super();
        this.query['coverageFilters'] = {
            clientId: config.clientId,
            operationalModel: config.operationalModel,
            stateName: config.stateName,
        };
    }
}

export default GetCitiesFilter;
