class StockDetail {
    storeReference: string;
    stock: number;

    constructor(config: {
        storeReference: string,
        stock: number
    }) {
        this.stock = config.stock;
        this.storeReference = config.storeReference;
    }

}

export default StockDetail;