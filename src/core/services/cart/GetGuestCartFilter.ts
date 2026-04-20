import Filter from '../../models/Filter';

class GetGuestCartFilter extends Filter {
    constructor(config: {
        cartId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
    }
}

export default GetGuestCartFilter;
