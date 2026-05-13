class AggregateBucket {
    constructor(
        public readonly min: number | null,
        public readonly max: number | null,
        public readonly key: string | null,
        public readonly docCount: number | null,
    ) {}

    static fromJson(json: Record<string, any>): AggregateBucket {
        return new AggregateBucket(
            json.min ?? null,
            json.max ?? null,
            json.key ?? null,
            json.docCount ?? null,
        );
    }
}

export default AggregateBucket;
