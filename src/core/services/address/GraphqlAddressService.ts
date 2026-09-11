import AddressService from './AddressService';
import GetAddressesFilter from './GetAddressesFilter';
import AddressModel from '../../models/address/AddressModel';
import getAddressesQuery from './queries/GetAddressesQuery';
import IGraphqlClient from '../../http/GraphqlClient';

class GraphqlAddressService implements AddressService {

    constructor(private readonly client: IGraphqlClient) {}

    async getAddresses(filter: GetAddressesFilter): Promise<AddressModel[]> {
        const response = await this.client.query(getAddressesQuery, filter.query);
        if (Array.isArray(response.data?.getAddresses)) {
            return response.data.getAddresses.map((a: Record<string, any>) => AddressModel.fromJson(a));
        }
        throw new Error(`getAddresses failed: ${JSON.stringify(response.errors || response)}`);
    }
}

export default GraphqlAddressService;
