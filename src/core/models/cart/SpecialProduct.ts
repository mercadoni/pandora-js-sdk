import Price from './Price';

class SpecialProduct {
    id: string;
    unitQuantity: number;
    unit: string;
    instruction: string | null;
    imageUrl: string;
    sku: string | null;
    name: string;
    status: string;
    price: Price;
    createdAt: string | null;

    constructor(config: {
        id: string;
        unitQuantity: number;
        unit: string;
        instruction?: string | null;
        imageUrl: string;
        sku?: string | null;
        name: string;
        status: string;
        price: Price;
        createdAt?: string | null;
    }) {
        this.id = config.id;
        this.unitQuantity = config.unitQuantity;
        this.unit = config.unit;
        this.instruction = config.instruction || null;
        this.imageUrl = config.imageUrl;
        this.sku = config.sku || null;
        this.name = config.name;
        this.status = config.status;
        this.price = config.price;
        this.createdAt = config.createdAt ?? null;
    }

    static fromJson(json: Record<string, any>): SpecialProduct {
        return new SpecialProduct({
            id: json.id || '',
            unitQuantity: json.unitQuantity || 0,
            unit: json.unit || '',
            instruction: json.instruction,
            imageUrl: json.imageUrl || '',
            sku: json.sku,
            name: json.name || '',
            status: json.status || '',
            price: json.price ? Price.fromJson(json.price) : new Price({}),
            createdAt: json.createdAt,
        });
    }
}

export default SpecialProduct;
