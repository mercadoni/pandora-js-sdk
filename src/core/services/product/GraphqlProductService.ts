import ProductService from './ProductService';
import SearchFilter from './SearchFilter';
import Search from '../../models/catalog/Search';
import Product from '../../models/catalog/Product';
import GetProductsBySKUFilter from './GetProductsBySKUFilter';
import GetSuggestedProductsFilter from './GetSuggestedProductsFilter';
import GetProductRecommendationsFilter from './GetProductRecommendationsFilter';
import searchProductsQuery from './queries/SearchProductsQuery';
import getProductsBySKUQuery from './queries/GetProductsBySKUQuery';
import getSuggestedProductsQuery from './queries/GetSuggestedProductsQuery';
import getProductRecommendationsQuery from './queries/GetProductRecommendationsQuery';

import IGraphqlClient from '../../http/GraphqlClient';

class GraphqlProductService implements ProductService {

    constructor(private readonly client: IGraphqlClient, private readonly clientId: string) {
        this.client = client;
        this.clientId = clientId;
    }

    async search(filter: SearchFilter): Promise<Search> {
        filter.query['clientId'] = this.clientId;
        const response = await this.client.query(searchProductsQuery, {
            searchProductsInput: filter.query,
        });
        if (response.data?.searchProducts) {
            return Search.fromJson(response.data.searchProducts);
        }
        throw new Error(`searchProducts failed: ${JSON.stringify(response.errors || response)}`);
    }

    async getProductsBySKU(filter: GetProductsBySKUFilter): Promise<Product[]> {
        filter.query['clientId'] = this.clientId;
        const response = await this.client.query(getProductsBySKUQuery, {
            getProductsBySKUInput: filter.query,
        });
        if (Array.isArray(response.data?.getProductsBySKU)) {
            return response.data.getProductsBySKU.map((p: Record<string, any>) => Product.fromJson(p));
        }
        throw new Error(`getProductsBySKU failed: ${JSON.stringify(response.errors || response)}`);
    }

    async getSuggestedProducts(filter: GetSuggestedProductsFilter): Promise<Product[]> {
        filter.query['clientId'] = this.clientId;
        const response = await this.client.query(getSuggestedProductsQuery, {
            getSuggestedProductsInput: filter.query,
        });
        if (Array.isArray(response.data?.getSuggestedProducts)) {
            return response.data.getSuggestedProducts.map((p: Record<string, any>) => Product.fromJson(p));
        }
        throw new Error(`getSuggestedProducts failed: ${JSON.stringify(response.errors || response)}`);
    }

    async getProductRecommendations(filter: GetProductRecommendationsFilter): Promise<Product[]> {
        filter.query['clientId'] = this.clientId;
        const response = await this.client.query(getProductRecommendationsQuery, {
            getProductRecommendationsInput: filter.query,
        });
        if (Array.isArray(response.data?.getProductRecommendations)) {
            return response.data.getProductRecommendations.map((p: Record<string, any>) => Product.fromJson(p));
        }
        throw new Error(`getProductRecommendations failed: ${JSON.stringify(response.errors || response)}`);
    }
}

export default GraphqlProductService;
