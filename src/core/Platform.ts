import GraphqlHomeService from "./services/home/GraphqlHomeService";
import GraphqlAuthService from "./services/auth/GraphqlAuthService";
import GraphqlCartService from "./services/cart/GraphqlCartService";
import GraphqlProductService from "./services/product/GraphqlProductService";
import GraphqlCategoryService from "./services/category/GraphqlCategoryService";
import GraphqlFulfillmentService from "./services/fulfillment/GraphqlFulfillmentService";
import Client from "./Client";
import Logger from "./http/Logger";

class Platform {

    private readonly client: Client;
    private readonly fulfillmentClient: Client;
    homeService: GraphqlHomeService;
    authService: GraphqlAuthService;
    cartService: GraphqlCartService;
    productService: GraphqlProductService;
    categoryService: GraphqlCategoryService;
    fulfillmentService: GraphqlFulfillmentService;
    private readonly clientId: string;

    constructor(config: {
        baseUrl: string;
        fulfillmentBaseUrl?: string;
        clientId: string;
        apiKey: string;
        debug?: boolean;
        logger?: Logger;
    }) {
        this.clientId = config.clientId;
        this.client = new Client(config.baseUrl, '', config.debug, config.logger);
        this.client.setHeaders({ "dpl-api-key": config.apiKey });
        const fulfillmentUrl = config.fulfillmentBaseUrl ?? config.baseUrl.replace('/v3', '/v2');
        this.fulfillmentClient = new Client(fulfillmentUrl, '', config.debug, config.logger);
        this.fulfillmentClient.setHeaders({ "dpl-api-key": config.apiKey });
        this.homeService = new GraphqlHomeService(this.client, config.clientId);
        this.authService = new GraphqlAuthService(this.client);
        this.cartService = new GraphqlCartService(this.client);
        this.productService = new GraphqlProductService(this.client, config.clientId);
        this.categoryService = new GraphqlCategoryService(this.client, config.clientId);
        this.fulfillmentService = new GraphqlFulfillmentService(this.fulfillmentClient);
    }

    setToken(token: string): void {
        this.client.setToken(token);
    }

    setHeaders(headers: Record<string, string>): void {
        this.client.setHeaders(headers);
    }
}

export default Platform;
