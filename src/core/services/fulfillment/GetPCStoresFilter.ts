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
        if (!config.filterKind && !config.filterState && !config.filterCity && !config.storeReferences?.length) {
            // An empty filter makes getPCStoresByClient return the organization's
            // entire store catalog; reject it at construction time instead.
            throw new Error(
                'GetPCStoresFilter requires at least one filter criterion: filterKind, filterState, filterCity or storeReferences'
            );
        }
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
