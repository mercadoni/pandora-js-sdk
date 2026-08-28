class CityModel {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly code: string | null,
        public readonly timeZone: string | null,
    ) {}

    static fromJson(json: Record<string, any>): CityModel {
        return new CityModel(
            json.id,
            json.name,
            json.code ?? null,
            json.timeZone ?? null,
        );
    }
}

export default CityModel;
