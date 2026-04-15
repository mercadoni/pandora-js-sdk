import GraphqlHomeService from "./services/home/GraphqlHomeService";
import GraphqlAuthService from "./services/auth/GraphqlAuthService";
import GraphqlCartService from "./services/cart/GraphqlCartService";
import Client from "./Client";
import Logger from "./http/Logger";

class Platform {

    private readonly client: Client;
    homeService: GraphqlHomeService;
    authService: GraphqlAuthService;
    cartService: GraphqlCartService;
    private readonly clientId: string;

    constructor(config: {
        baseUrl: string;
        clientId: string;
        debug?: boolean;
        logger?: Logger;
    }) {
        this.clientId = config.clientId;
        this.client = new Client(config.baseUrl, '', config.debug, config.logger);
        this.homeService = new GraphqlHomeService(this.client, config.clientId);
        this.authService = new GraphqlAuthService(this.client);
        this.cartService = new GraphqlCartService(this.client);
    }

    setToken(token: string): void {
        this.client.setToken(token);
    }
}

export default Platform;
