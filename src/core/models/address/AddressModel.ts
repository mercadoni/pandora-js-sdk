class AddressModel {
    constructor(
        public readonly id: string,
        public readonly description: string,
        public readonly address: { other: string } | null,
        public readonly addressTwo: string | null,
        public readonly available: boolean | null,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly city: string | null,
        public readonly state: string | null,
        public readonly zipCode: string | null,
        public readonly customerId: string | null,
    ) {}

    static fromJson(json: Record<string, any>): AddressModel {
        return new AddressModel(
            json.id,
            json.description,
            json.address ?? null,
            json.addressTwo ?? null,
            json.available ?? null,
            json.latitude,
            json.longitude,
            json.city ?? null,
            json.state ?? null,
            json.zipCode ?? null,
            json.customerId ?? null,
        );
    }
}

export default AddressModel;
