class PurchaseDetail {
    id: string | null;
    jobId: string | null;
    jobNumber: string | null;
    deliverySlot: Record<string, any> | null;

    constructor(config: {
        id?: string | null;
        jobId?: string | null;
        jobNumber?: string | null;
        deliverySlot?: Record<string, any> | null;
    }) {
        this.id = config.id || null;
        this.jobId = config.jobId || null;
        this.jobNumber = config.jobNumber || null;
        this.deliverySlot = config.deliverySlot || null;
    }

    static fromJson(json: Record<string, any>): PurchaseDetail {
        return new PurchaseDetail({
            id: json.id,
            jobId: json.jobId,
            jobNumber: json.jobNumber,
            deliverySlot: json.deliverySlot || null,
        });
    }
}

class Purchase {
    id: string | null;
    status: string | null;
    jobId: string | null;
    jobNumber: string | null;
    lobbyScreenToken: string | null;
    jobExternalId: string | null;
    purchaseDetails: Array<PurchaseDetail>;

    constructor(config: {
        id?: string | null;
        status?: string | null;
        jobId?: string | null;
        jobNumber?: string | null;
        lobbyScreenToken?: string | null;
        jobExternalId?: string | null;
        purchaseDetails?: Array<PurchaseDetail>;
    }) {
        this.id = config.id || null;
        this.status = config.status || null;
        this.jobId = config.jobId || null;
        this.jobNumber = config.jobNumber || null;
        this.lobbyScreenToken = config.lobbyScreenToken || null;
        this.jobExternalId = config.jobExternalId || null;
        this.purchaseDetails = config.purchaseDetails || [];
    }

    static fromJson(json: Record<string, any>): Purchase {
        return new Purchase({
            id: json.id,
            status: json.status,
            jobId: json.jobId,
            jobNumber: json.jobNumber,
            lobbyScreenToken: json.lobbyScreenToken,
            jobExternalId: json.jobExtenalId, // note: API has a typo
            purchaseDetails: Array.isArray(json.purchaseDetails)
                ? json.purchaseDetails.map(PurchaseDetail.fromJson)
                : [],
        });
    }
}

export { PurchaseDetail };
export default Purchase;
