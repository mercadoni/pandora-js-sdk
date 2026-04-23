import Input from '../../models/Input';

class CouponInput extends Input {
    constructor(config: {
        cartId: string;
        couponCode?: string;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        if (config.couponCode !== undefined) this.query['couponCode'] = config.couponCode;
    }
}

export default CouponInput;
