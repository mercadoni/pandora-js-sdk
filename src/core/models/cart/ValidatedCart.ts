import Cart from './Cart';
import CartProduct from './CartProduct';
import SpecialProduct from './SpecialProduct';
import PricesSummary from './PricesSummary';

class ValidatedCart extends Cart {
    groups: Array<Record<string, any>>;
    loyalty: Record<string, any> | null;
    externalPromotions: Record<string, any> | null;

    constructor(config: {
        id: string;
        operationalModel: string;
        status?: string | null;
        paymentConfigurationId?: string | null;
        products: Array<CartProduct>;
        specialProducts: Array<SpecialProduct>;
        customer?: Record<string, any> | null;
        store: Record<string, any>;
        address?: Record<string, any> | null;
        pricesSummary: PricesSummary;
        storeConfiguration: Record<string, any>;
        coupon?: Record<string, any> | null;
        deliverySlot?: Record<string, any> | null;
        validationIssues?: Array<Record<string, any>>;
        groups?: Array<Record<string, any>>;
        loyalty?: Record<string, any> | null;
        externalPromotions?: Record<string, any> | null;
    }) {
        super(config);
        this.groups = config.groups || [];
        this.loyalty = config.loyalty || null;
        this.externalPromotions = config.externalPromotions || null;
    }

    static fromJson(json: Record<string, any>): ValidatedCart {
        const base = Cart.fromJson(json);
        return new ValidatedCart({
            ...base,
            groups: json.groups || [],
            loyalty: json.loyalty || null,
            externalPromotions: json.externalPromotions || null,
        });
    }
}

export default ValidatedCart;
