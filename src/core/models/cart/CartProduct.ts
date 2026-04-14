import Price from './Price';

class CartProduct {
    id: string;
    unitQuantity: number;
    baseUnitPrice: number;
    baseUnitPriceBeforeTaxes: number;
    reference: string;
    unit: string | null;
    variant: string | null;
    instruction: string | null;
    status: string | null;
    imageUrl: string | null;
    name: string;
    availability: boolean;
    baseUnit: string;
    stockWarning: boolean;
    maxUnitQuantity: number;
    minUnitQuantity: number;
    price: Price;
    substitutes: {
        substituteMode: string | null;
        substituteProducts: Array<string>;
    };

    constructor(config: {
        id: string;
        unitQuantity: number;
        baseUnitPrice: number;
        baseUnitPriceBeforeTaxes: number;
        reference: string;
        unit?: string | null;
        variant?: string | null;
        instruction?: string | null;
        status?: string | null;
        imageUrl?: string | null;
        name: string;
        availability: boolean;
        baseUnit: string;
        stockWarning: boolean;
        maxUnitQuantity: number;
        minUnitQuantity: number;
        price: Price;
        substitutes?: {
            substituteMode: string | null;
            substituteProducts: Array<string>;
        };
    }) {
        this.id = config.id;
        this.unitQuantity = config.unitQuantity;
        this.baseUnitPrice = config.baseUnitPrice;
        this.baseUnitPriceBeforeTaxes = config.baseUnitPriceBeforeTaxes;
        this.reference = config.reference;
        this.unit = config.unit || null;
        this.variant = config.variant || null;
        this.instruction = config.instruction || null;
        this.status = config.status || null;
        this.imageUrl = config.imageUrl || null;
        this.name = config.name;
        this.availability = config.availability;
        this.baseUnit = config.baseUnit;
        this.stockWarning = config.stockWarning;
        this.maxUnitQuantity = config.maxUnitQuantity;
        this.minUnitQuantity = config.minUnitQuantity;
        this.price = config.price;
        this.substitutes = config.substitutes || { substituteMode: null, substituteProducts: [] };
    }

    static fromJson(json: Record<string, any>): CartProduct {
        return new CartProduct({
            id: json.id || '',
            unitQuantity: json.unitQuantity || 0,
            baseUnitPrice: json.baseUnitPrice || 0,
            baseUnitPriceBeforeTaxes: json.baseUnitPriceBeforeTaxes || 0,
            reference: json.reference || '',
            unit: json.unit,
            variant: json.variant,
            instruction: json.instruction,
            status: json.status,
            imageUrl: json.imageUrl,
            name: json.name || '',
            availability: json.availability || false,
            baseUnit: json.baseUnit || '',
            stockWarning: json.stockWarning || false,
            maxUnitQuantity: json.maxUnitQuantity || 0,
            minUnitQuantity: json.minUnitQuantity || 0,
            price: json.price ? Price.fromJson(json.price) : new Price({}),
            substitutes: json.substitutes || { substituteMode: null, substituteProducts: [] },
        });
    }
}

export default CartProduct;
