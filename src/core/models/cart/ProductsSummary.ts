class ProductsSummary {
    readonly productsTotal: number;
    readonly fullProductsPrice: number;
    readonly totalProductsDiscount: number;
    readonly missingForMinimumOrderValue: number;
    readonly missingForFreeShipping: number;
    readonly isApplicableForFreeShipping: boolean;
    readonly productsTotalBeforeTaxes: number;
    readonly fullProductsPriceBeforeTaxes: number;
    readonly totalProductsDiscountBeforeTaxes: number;
    readonly missingForMinimumOrderValueBeforeTaxes: number;
    readonly missingForFreeShippingBeforeTaxes: number;

    constructor(config: {
        productsTotal?: number;
        fullProductsPrice?: number;
        totalProductsDiscount?: number;
        missingForMinimumOrderValue?: number;
        missingForFreeShipping?: number;
        isApplicableForFreeShipping?: boolean;
        productsTotalBeforeTaxes?: number;
        fullProductsPriceBeforeTaxes?: number;
        totalProductsDiscountBeforeTaxes?: number;
        missingForMinimumOrderValueBeforeTaxes?: number;
        missingForFreeShippingBeforeTaxes?: number;
    }) {
        this.productsTotal = config.productsTotal || 0;
        this.fullProductsPrice = config.fullProductsPrice || 0;
        this.totalProductsDiscount = config.totalProductsDiscount || 0;
        this.missingForMinimumOrderValue = config.missingForMinimumOrderValue || 0;
        this.missingForFreeShipping = config.missingForFreeShipping || 0;
        this.isApplicableForFreeShipping = config.isApplicableForFreeShipping || false;
        this.productsTotalBeforeTaxes = config.productsTotalBeforeTaxes || 0;
        this.fullProductsPriceBeforeTaxes = config.fullProductsPriceBeforeTaxes || 0;
        this.totalProductsDiscountBeforeTaxes = config.totalProductsDiscountBeforeTaxes || 0;
        this.missingForMinimumOrderValueBeforeTaxes = config.missingForMinimumOrderValueBeforeTaxes || 0;
        this.missingForFreeShippingBeforeTaxes = config.missingForFreeShippingBeforeTaxes || 0;
    }

    static fromJson(json: Record<string, any>): ProductsSummary {
        return new ProductsSummary({
            productsTotal: json.productsTotal,
            fullProductsPrice: json.fullProductsPrice,
            totalProductsDiscount: json.totalProductsDiscount,
            missingForMinimumOrderValue: json.missingForMinimumOrderValue,
            missingForFreeShipping: json.missingForFreeShipping,
            isApplicableForFreeShipping: json.isApplicableForFreeShipping,
            productsTotalBeforeTaxes: json.productsTotalBeforeTaxes,
            fullProductsPriceBeforeTaxes: json.fullProductsPriceBeforeTaxes,
            totalProductsDiscountBeforeTaxes: json.totalProductsDiscountBeforeTaxes,
            missingForMinimumOrderValueBeforeTaxes: json.missingForMinimumOrderValueBeforeTaxes,
            missingForFreeShippingBeforeTaxes: json.missingForFreeShippingBeforeTaxes,
        });
    }
}

export default ProductsSummary;
