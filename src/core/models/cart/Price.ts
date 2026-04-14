class Price {
    taxes: number;
    subtotal: number;
    fullPrice: number;
    discount: number;
    total: number;
    totalBeforeTaxes: number;

    constructor(config: {
        taxes?: number;
        subtotal?: number;
        fullPrice?: number;
        discount?: number;
        total?: number;
        totalBeforeTaxes?: number;
    }) {
        this.taxes = config.taxes || 0;
        this.subtotal = config.subtotal || 0;
        this.fullPrice = config.fullPrice || 0;
        this.discount = config.discount || 0;
        this.total = config.total || 0;
        this.totalBeforeTaxes = config.totalBeforeTaxes || 0;
    }

    static fromJson(json: Record<string, any>): Price {
        return new Price({
            taxes: json.taxes,
            subtotal: json.subtotal,
            fullPrice: json.fullPrice,
            discount: json.discount,
            total: json.total,
            totalBeforeTaxes: json.totalBeforeTaxes,
        });
    }
}

export default Price;
