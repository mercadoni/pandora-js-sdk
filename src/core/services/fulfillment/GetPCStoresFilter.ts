import Input from '../../models/Input';

class GetPCStoresFilter extends Input {
    constructor(config: {
        clientId: string;
        filterState: string;
        filterCity: string;
        filterKind?: string;
        storeReferences?: string[];
    }) {
        super();
        this.query['clientId'] = config.clientId;
        const filter: Record<string, string> = { state: config.filterState, city: config.filterCity };
        if (config.filterKind !== undefined) filter['kind'] = config.filterKind;
        this.query['filter'] = filter;
        if (config.storeReferences !== undefined) this.query['storeReferences'] = config.storeReferences;
    }
}

export default GetPCStoresFilter;
