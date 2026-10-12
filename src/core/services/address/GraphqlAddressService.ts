import AddressService from './AddressService';
import GetAddressesFilter from './GetAddressesFilter';
import CreateAddressInput from './CreateAddressInput';
import AddressModel from '../../models/address/AddressModel';
import getAddressesQuery from './queries/GetAddressesQuery';
import upsertAddressMutation from './mutations/UpsertAddressMutation';
import IGraphqlClient from '../../http/GraphqlClient';

class GraphqlAddressService implements AddressService {

    constructor(private readonly client: IGraphqlClient) {}

    async getAddresses(filter: GetAddressesFilter): Promise<AddressModel[]> {
        const input = filter.query['getAddressesInput'] as { pageSize?: number; currentPage?: number };
        this.assertPositiveInteger('pageSize', input.pageSize);
        this.assertPositiveInteger('currentPage', input.currentPage);
        const response = await this.client.query(getAddressesQuery, filter.query);
        if (Array.isArray(response.data?.getAddresses)) {
            return response.data.getAddresses.map((a: Record<string, any>) => AddressModel.fromJson(a));
        }
        throw new Error(`getAddresses failed: ${JSON.stringify(response.errors || response)}`);
    }

    async createAddress(input: CreateAddressInput): Promise<AddressModel> {
        const payload = input.query['upsertAddressInput'] as Record<string, any>;
        for (const [name, value] of [
            ['description', payload.description],
            ['address.other', payload.address?.other],
            ['city', payload.city],
            ['storeReference', payload.storeReference],
        ]) {
            if (typeof value !== 'string' || value.trim() === '') {
                throw new Error(`createAddress failed: ${name} must be a non-empty string`);
            }
        }
        this.assertInRange('latitude', payload.latitude, -90, 90);
        this.assertInRange('longitude', payload.longitude, -180, 180);
        const response = await this.client.mutation(upsertAddressMutation, { upsertAddressInput: payload });
        if (response.data?.upsertAddress) {
            return AddressModel.fromJson(response.data.upsertAddress);
        }
        throw new Error(`createAddress failed: ${JSON.stringify(response.errors || response)}`);
    }

    private assertInRange(name: string, value: unknown, min: number, max: number): void {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
            throw new Error(`createAddress failed: ${name} must be a number between ${min} and ${max}`);
        }
    }

    private assertPositiveInteger(name: string, value: number | undefined): void {
        if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
            throw new Error(`getAddresses failed: ${name} must be an integer >= 1`);
        }
    }
}

export default GraphqlAddressService;
