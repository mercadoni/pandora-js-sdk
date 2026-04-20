import Filter from '../../models/Filter';

class ValidateGuestCartFilter extends Filter {
    constructor(config: {
        cartId: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
    }
}

export default ValidateGuestCartFilter;
