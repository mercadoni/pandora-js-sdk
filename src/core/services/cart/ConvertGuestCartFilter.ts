import Filter from '../../models/Filter';

class ConvertGuestCartFilter extends Filter {
    constructor(config: {
        cartId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
    }
}

export default ConvertGuestCartFilter;
