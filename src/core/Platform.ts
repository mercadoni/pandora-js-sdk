import GraphqlHomeService from "./services/home/GraphqlHomeService";
import GraphqlAuthService from "./services/auth/GraphqlAuthService";
import GraphqlCartService from "./services/cart/GraphqlCartService";
import GraphqlProductService from "./services/product/GraphqlProductService";
import GraphqlCategoryService from "./services/category/GraphqlCategoryService";
import GraphqlFulfillmentService from "./services/fulfillment/GraphqlFulfillmentService";
import GraphqlAddressService from "./services/address/GraphqlAddressService";
import Client from "./Client";
import Logger from "./http/Logger";
import { API_VERSION_BY_SERVICE, type ApiService, type ApiVersion, versionedApiUrl } from "./apiVersionMap";

type PlatformConfig = {
    baseUrl: string;
    clientId: string;
    apiKey: string;
    debug?: boolean;
    logger?: Logger;
};

class Platform {

    private readonly clients: Record<ApiVersion, Client>;
    homeService: GraphqlHomeService;
    authService: GraphqlAuthService;
    cartService: GraphqlCartService;
    productService: GraphqlProductService;
    categoryService: GraphqlCategoryService;
    fulfillmentService: GraphqlFulfillmentService;
    addressService: GraphqlAddressService;

    constructor(config: PlatformConfig) {
        this.clients = {
            v2: this.createClient(config, 'v2'),
            v3: this.createClient(config, 'v3'),
        };

        this.homeService = new GraphqlHomeService(this.clientFor('home'), config.clientId);
        this.authService = new GraphqlAuthService(this.clientFor('auth'));
        this.cartService = new GraphqlCartService(this.clientFor('cart'));
        this.productService = new GraphqlProductService(this.clientFor('product'), config.clientId);
        this.categoryService = new GraphqlCategoryService(this.clientFor('category'), config.clientId);
        this.fulfillmentService = new GraphqlFulfillmentService(this.clientFor('fulfillment'));
        this.addressService = new GraphqlAddressService(this.clientFor('address'));
    }

    setToken(token: string): void {
        this.clients.v2.setToken(token);
        this.clients.v3.setToken(token);
    }

    setHeaders(headers: Record<string, string>): void {
        this.clients.v2.setHeaders(headers);
        this.clients.v3.setHeaders(headers);
    }

    private clientFor(service: ApiService): Client {
        return this.clients[API_VERSION_BY_SERVICE[service]];
    }

    private createClient(config: PlatformConfig, version: ApiVersion): Client {
        const client = new Client(versionedApiUrl(config.baseUrl, version), '', config.debug, config.logger);
        client.setHeaders({ "dpl-api-key": config.apiKey });
        return client;
    }
}

export default Platform;
