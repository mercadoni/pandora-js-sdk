import FulfillmentService from './FulfillmentService';
import GetOperationalModelsFilter from './GetOperationalModelsFilter';
import GetStoresNearbyFilter from './GetStoresNearbyFilter';
import GetPCStoresFilter from './GetPCStoresFilter';
import GetStatesFilter from './GetStatesFilter';
import GetCitiesFilter from './GetCitiesFilter';
import StoreModel from '../../models/fulfillment/StoreModel';
import StateModel from '../../models/fulfillment/StateModel';
import CityModel from '../../models/fulfillment/CityModel';
import getOperationalModelsQuery from './queries/GetOperationalModelsQuery';
import getStoresNearbyQuery from './queries/GetStoresNearbyQuery';
import getPCStoresByClientQuery from './queries/GetPCStoresByClientQuery';
import getStatesQuery from './queries/GetStatesQuery';
import getCitiesQuery from './queries/GetCitiesQuery';
import IGraphqlClient from '../../http/GraphqlClient';

class GraphqlFulfillmentService implements FulfillmentService {

    constructor(private readonly client: IGraphqlClient) {}

    async getOperationalModels(filter: GetOperationalModelsFilter): Promise<{ operationalModels: string[] }> {
        const response = await this.client.query(getOperationalModelsQuery, filter.query);
        if (response.data?.getOperationalModelByClient) {
            return response.data.getOperationalModelByClient;
        }
        throw new Error(`getOperationalModelByClient failed: ${JSON.stringify(response.errors || response)}`);
    }

    async getStoresNearby(filter: GetStoresNearbyFilter): Promise<StoreModel[]> {
        const response = await this.client.query(getStoresNearbyQuery, filter.query);
        if (Array.isArray(response.data?.getStoresNearbyByCoords)) {
            return response.data.getStoresNearbyByCoords.map((s: Record<string, any>) => StoreModel.fromJson(s));
        }
        throw new Error(`getStoresNearbyByCoords failed: ${JSON.stringify(response.errors || response)}`);
    }

    async getPCStores(filter: GetPCStoresFilter): Promise<StoreModel[]> {
        const response = await this.client.query(getPCStoresByClientQuery, filter.query);
        if (Array.isArray(response.data?.getPCStoresByClient)) {
            return response.data.getPCStoresByClient.map((s: Record<string, any>) => StoreModel.fromJson(s));
        }
        throw new Error(`getPCStoresByClient failed: ${JSON.stringify(response.errors || response)}`);
    }

    async getStates(filter: GetStatesFilter): Promise<StateModel[]> {
        const response = await this.client.query(getStatesQuery, filter.query);
        if (Array.isArray(response.data?.getStates)) {
            return response.data.getStates.map((s: Record<string, any>) => StateModel.fromJson(s));
        }
        throw new Error(`getStates failed: ${JSON.stringify(response.errors || response)}`);
    }

    async getCities(filter: GetCitiesFilter): Promise<CityModel[]> {
        const response = await this.client.query(getCitiesQuery, filter.query);
        if (Array.isArray(response.data?.getCities)) {
            return response.data.getCities.map((c: Record<string, any>) => CityModel.fromJson(c));
        }
        throw new Error(`getCities failed: ${JSON.stringify(response.errors || response)}`);
    }
}

export default GraphqlFulfillmentService;
