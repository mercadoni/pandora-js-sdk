import Filter from '../../models/Filter';

class PurchaseCartFilter extends Filter {
    constructor(config: {
        cartId: string;
        paymentInput: {
            paymentMethod?: {
                type: string;
                name: string;
            };
            onlinePaymentParams?: Record<string, any>;
            paymentMethodDetail?: string;
        };
        slot?: {
            id: string;
            from: string;
            to: string;
            expiresAt: string;
            type?: string;
        };
        allowSplitOrders?: boolean;
        curbside?: boolean;
    }) {
        super();
        this.query['cartId'] = config.cartId;
        this.query['paymentInput'] = config.paymentInput;
        if (config.slot) this.query['slot'] = config.slot;
        if (config.allowSplitOrders !== undefined) this.query['allowSplitOrders'] = config.allowSplitOrders;
        if (config.curbside !== undefined) this.query['curbside'] = config.curbside;
    }
}

export default PurchaseCartFilter;
