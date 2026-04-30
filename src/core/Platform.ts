import GraphqlHomeService from "./services/home/GraphqlHomeService";
import GraphqlAuthService from "./services/auth/GraphqlAuthService";
import GraphqlCartService from "./services/cart/GraphqlCartService";
import GraphqlProductService from "./services/product/GraphqlProductService";
import Client from "./Client";
import Logger from "./http/Logger";

class Platform {

    private readonly client: Client;
    homeService: GraphqlHomeService;
    authService: GraphqlAuthService;
    cartService: GraphqlCartService;
    productService: GraphqlProductService;
    private readonly clientId: string;

    constructor(config: {
        baseUrl: string;
        clientId: string;
        apiKey: string;
        debug?: boolean;
        logger?: Logger;
    }) {
        this.clientId = config.clientId;
        this.client = new Client(config.baseUrl, '', config.debug, config.logger);
        this.client.setHeaders({ "dpl-api-key": config.apiKey });
        this.homeService = new GraphqlHomeService(this.client, config.clientId);
        this.authService = new GraphqlAuthService(this.client);
        this.cartService = new GraphqlCartService(this.client);
        this.productService = new GraphqlProductService(this.client, config.clientId);
    }

    setToken(token: string): void {
        this.client.setToken(token);
    }

    setHeaders(headers: Record<string, string>): void {
        this.client.setHeaders(headers);
    }
}

export default Platform;
