import AggregateBucket from './AggregateBucket';

class Aggregate {
    constructor(
        public readonly name: string,
        public readonly docCount: number | null,
        public readonly isFromSpecification: boolean,
        public readonly buckets: AggregateBucket[],
    ) {}

    static fromJson(json: Record<string, any>): Aggregate {
        const buckets = Array.isArray(json.buckets)
            ? json.buckets.map((b: Record<string, any>) => AggregateBucket.fromJson(b))
            : [];
        return new Aggregate(
            json.name ?? '',
            json.docCount ?? null,
            json.isFromSpecification ?? false,
            buckets,
        );
    }
}

export default Aggregate;
