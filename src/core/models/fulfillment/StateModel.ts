class StateModel {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly active: boolean | null,
    ) {}

    static fromJson(json: Record<string, any>): StateModel {
        return new StateModel(
            json.id,
            json.name,
            json.active ?? null,
        );
    }
}

export default StateModel;
