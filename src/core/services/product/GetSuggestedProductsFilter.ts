import Input
    from "../../models/Input";

class GetSuggestedProductsFilter extends Input {

    constructor(config: {
        sku: string;
        storeReference: string;
    }) {
        super();
        this.query['sku'] = config.sku;
        this.query['storeReference'] = config.storeReference;
    }

}

export default GetSuggestedProductsFilter;
