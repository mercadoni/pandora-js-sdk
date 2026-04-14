class PricesSummary {
    shippingFee: number;
    taxes: number;
    discounts: number;
    subtotal: number;
    total: number;
    totalBeforeTaxes: number;
    fullPrice: number;

    constructor(config: {
        shippingFee?: number;
        taxes?: number;
        discounts?: number;
        subtotal?: number;
        total?: number;
        totalBeforeTaxes?: number;
        fullPrice?: number;
    }) {
        this.shippingFee = config.shippingFee || 0;
        this.taxes = config.taxes || 0;
        this.discounts = config.discounts || 0;
        this.subtotal = config.subtotal || 0;
        this.total = config.total || 0;
        this.totalBeforeTaxes = config.totalBeforeTaxes || 0;
        this.fullPrice = config.fullPrice || 0;
    }

    static fromJson(json: Record<string, any>): PricesSummary {
        return new PricesSummary({
            shippingFee: json.shippingFee,
            taxes: json.taxes,
            discounts: json.discounts,
            subtotal: json.subtotal,
            total: json.total,
            totalBeforeTaxes: json.totalBeforeTaxes,
            fullPrice: json.fullPrice,
        });
    }
}

export default PricesSummary;
