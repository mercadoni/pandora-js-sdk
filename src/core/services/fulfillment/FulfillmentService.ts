import GetOperationalModelsFilter from './GetOperationalModelsFilter';
import GetStoresNearbyFilter from './GetStoresNearbyFilter';
import GetPCStoresFilter from './GetPCStoresFilter';
import GetStatesFilter from './GetStatesFilter';
import GetCitiesFilter from './GetCitiesFilter';
import StoreModel from '../../models/fulfillment/StoreModel';
import StateModel from '../../models/fulfillment/StateModel';
import CityModel from '../../models/fulfillment/CityModel';

interface FulfillmentService {
    getOperationalModels(filter: GetOperationalModelsFilter): Promise<{ operationalModels: string[] }>;
    getStoresNearby(filter: GetStoresNearbyFilter): Promise<StoreModel[]>;
    getPCStores(filter: GetPCStoresFilter): Promise<StoreModel[]>;
    getStates(filter: GetStatesFilter): Promise<StateModel[]>;
    getCities(filter: GetCitiesFilter): Promise<CityModel[]>;
}

export default FulfillmentService;
