import ProductService from "./ProductService";
import SearchFilter from "../../models/SearchFilter";
import Search from "../../models/Search";
import Product from "../../models/catalog/Product";
import GetProductsBySKUFilter from "./GetProductsBySKUFilter";
import GetSuggestedProductsFilter from "./GetSuggestedProductsFilter";
import GetProductRecommendationsFilter from "./GetProductRecommendationsFilter";
import getProductsBySKUQuery from "./queries/GetProductsBySKUQuery";
import getSuggestedProductsQuery from "./queries/GetSuggestedProductsQuery";
import getProductRecommendationsQuery from "./queries/GetProductRecommendationsQuery";

import IGraphqlClient from "../../http/GraphqlClient";

class GraphqlProductService implements ProductService {

    constructor(private readonly client: IGraphqlClient, private readonly clientId: string) {
        this.client = client;
        this.clientId = clientId;
    }

    async search(filter: SearchFilter): Promise<Search> {
        throw new Error("Method not implemented.");
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
