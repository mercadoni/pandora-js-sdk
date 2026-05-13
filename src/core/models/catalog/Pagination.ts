class Pagination {
    constructor(
        public readonly page: number,
        public readonly pages: number,
        public readonly total: { value: number | null; relation: string | null } | null,
    ) {}

    static fromJson(json: Record<string, any>): Pagination {
        const total = json.total
            ? { value: json.total.value ?? null, relation: json.total.relation ?? null }
            : null;
        return new Pagination(json.page ?? 0, json.pages ?? 0, total);
    }
}

export default Pagination;
