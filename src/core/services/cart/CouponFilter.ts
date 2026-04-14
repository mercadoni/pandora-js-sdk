import Filter from '../../models/Filter';

class CouponFilter extends Filter {
    constructor(config: {
        cartId: string;
        couponCode?: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        if (config.couponCode !== undefined) this.query['couponCode'] = config.couponCode;
    }
}

export default CouponFilter;
