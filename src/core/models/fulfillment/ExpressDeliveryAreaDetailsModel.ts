class ExpressDeliveryAreaDetailsModel {
    constructor(public readonly available: boolean) {}

    static fromJson(json: Record<string, any>): ExpressDeliveryAreaDetailsModel {
        return new ExpressDeliveryAreaDetailsModel(json.available);
    }
}

export default ExpressDeliveryAreaDetailsModel;
