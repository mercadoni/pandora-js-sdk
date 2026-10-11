import AddressService from './AddressService';
import GetAddressesFilter from './GetAddressesFilter';
import AddressModel from '../../models/address/AddressModel';
import getAddressesQuery from './queries/GetAddressesQuery';
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

    private assertPositiveInteger(name: string, value: number | undefined): void {
        if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
            throw new Error(`getAddresses failed: ${name} must be an integer >= 1`);
        }
    }
}

export default GraphqlAddressService;
