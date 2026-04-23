import Input
    from "../../models/Input";

class HomeFilter extends Input {

    constructor(filter: {
        byPlatform: string,
        byStore: string,
        byScreenSize: string,

    }) {
        super();
        this.query['targetType'] = filter.byPlatform;
        this.query['breakpointId'] = filter.byScreenSize;
        this.query['storeReference'] = filter.byStore;
    }

}

export default HomeFilter;