import Input from '../../models/Input';

class GetCategoryTreeFilter extends Input {
    constructor(config: {
        storeReference: string;
    }) {
        super();
        this.query['storeReference'] = config.storeReference;
    }
}

export default GetCategoryTreeFilter;
