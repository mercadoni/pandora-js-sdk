import CartProduct from './CartProduct';
import SpecialProduct from './SpecialProduct';
import PricesSummary from './PricesSummary';

class Cart {
    id: string;
    operationalModel: string;
    status: string | null;
    paymentConfigurationId: string | null;
    products: Array<CartProduct>;
    specialProducts: Array<SpecialProduct>;
    customer: Record<string, any> | null;
    store: Record<string, any>;
    address: Record<string, any> | null;
    pricesSummary: PricesSummary;
    storeConfiguration: Record<string, any>;
    coupon: Record<string, any> | null;
    deliverySlot: Record<string, any> | null;
    validationIssues: Array<Record<string, any>>;

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
    }) {
        this.id = config.id;
        this.operationalModel = config.operationalModel;
        this.status = config.status || null;
        this.paymentConfigurationId = config.paymentConfigurationId || null;
        this.products = config.products;
        this.specialProducts = config.specialProducts;
        this.customer = config.customer || null;
        this.store = config.store;
        this.address = config.address || null;
        this.pricesSummary = config.pricesSummary;
        this.storeConfiguration = config.storeConfiguration;
        this.coupon = config.coupon || null;
        this.deliverySlot = config.deliverySlot || null;
        this.validationIssues = config.validationIssues || [];
    }

    static fromJson(json: Record<string, any>): Cart {
        return new Cart({
            id: json.id || '',
            operationalModel: json.operationalModel || '',
            status: json.status,
            paymentConfigurationId: json.paymentConfigurationId,
            products: Array.isArray(json.products) ? json.products.map(CartProduct.fromJson) : [],
            specialProducts: Array.isArray(json.specialProducts) ? json.specialProducts.map(SpecialProduct.fromJson) : [],
            customer: json.customer || null,
            store: json.store || {},
            address: json.address || null,
            pricesSummary: json.pricesSummary ? PricesSummary.fromJson(json.pricesSummary) : new PricesSummary({}),
            storeConfiguration: json.storeConfiguration || {},
            coupon: json.coupon || null,
            deliverySlot: json.deliverySlot || null,
            validationIssues: json.validationIssues || [],
        });
    }
}

export default Cart;
