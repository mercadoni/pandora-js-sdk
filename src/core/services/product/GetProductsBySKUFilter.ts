import Input
    from "../../models/Input";

class GetProductsBySKUFilter extends Input {

    constructor(config: {
        skus: string[];
        storeReference: string;
    }) {
        super();
        this.query['skus'] = config.skus;
        this.query['storeReference'] = config.storeReference;
    }

}

export default GetProductsBySKUFilter;
