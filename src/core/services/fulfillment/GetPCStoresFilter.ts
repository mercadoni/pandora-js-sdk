import Input from '../../models/Input';

class GetPCStoresFilter extends Input {
    constructor(config: {
        clientId: string;
        filterKind?: string;
        filterState?: string;
        filterCity?: string;
        storeReferences?: string[];
    }) {
        super();
        this.query['clientId'] = config.clientId;
        const filter: Record<string, string> = {};
        if (config.filterKind !== undefined) filter['kind'] = config.filterKind;
        if (config.filterState !== undefined) filter['state'] = config.filterState;
        if (config.filterCity !== undefined) filter['city'] = config.filterCity;
        if (Object.keys(filter).length > 0) this.query['filter'] = filter;
        if (config.storeReferences !== undefined) this.query['storeReferences'] = config.storeReferences;
    }
}

export default GetPCStoresFilter;
