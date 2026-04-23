import Input from '../../models/Input';

class UpdateCartInput extends Input {
    constructor(config: {
        cartId: string;
        storeReference?: string;
        addressId?: string;
        operationalModel?: string;
        slot?: {
            id: string;
            from: string;
            to: string;
            expiresAt: string;
            type?: string;
        };
        paymentMethod?: {
            type: string;
            name: string;
        };
        billing?: Record<string, any>;
        loyalty?: {
            selectedRedemption?: {
                points: number;
            };
        };
        onlinePaymentParams?: Record<string, any>;
        extraField?: {
            gift?: string;
            openText?: string;
        };
    }) {
        super();
        this.query['cartId'] = config.cartId;
        if (config.storeReference) this.query['storeReference'] = config.storeReference;
        if (config.addressId) this.query['addressId'] = config.addressId;
        if (config.operationalModel) this.query['operationalModel'] = config.operationalModel;
        if (config.slot) this.query['slot'] = config.slot;
        if (config.paymentMethod) this.query['paymentMethod'] = config.paymentMethod;
        if (config.billing) this.query['billing'] = config.billing;
        if (config.loyalty) this.query['loyalty'] = config.loyalty;
        if (config.onlinePaymentParams) this.query['onlinePaymentParams'] = config.onlinePaymentParams;
        if (config.extraField) this.query['extraField'] = config.extraField;
    }
}

export default UpdateCartInput;
