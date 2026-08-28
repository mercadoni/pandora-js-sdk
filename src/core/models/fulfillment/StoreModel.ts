class StoreModel {
    constructor(
        public readonly id: string,
        public readonly code: string,
        public readonly name: string,
        public readonly address: string,
        public readonly phone: string | null,
        public readonly state: string | null,
        public readonly cities: { name: string }[],
        public readonly country: string | null,
        public readonly operationModel: string | null,
        public readonly serviceFee: { PICK_AND_COLLECT: number; DELIVERY: number } | null,
        public readonly usedIfNotCoverage: boolean | null,
    ) {}

    static fromJson(json: Record<string, any>): StoreModel {
        return new StoreModel(
            json.id,
            json.code,
            json.name,
            json.address,
            json.phone ?? null,
            json.state ?? null,
            Array.isArray(json.cities) ? json.cities : [],
            json.country ?? null,
            json.operationModel ?? null,
            json.serviceFee ?? null,
            json.usedIfNotCoverage ?? null,
        );
    }
}

export default StoreModel;
