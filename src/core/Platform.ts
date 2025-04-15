import HomeService
    from "./services/home/GraphqlHomeService";
import GraphqlClient
    from "./http/GraphqlClient";
import GraphqlHomeService
    from "./services/home/GraphqlHomeService";
import Client from "./Client";

class Platform {

    private readonly client: GraphqlClient
    homeService: HomeService;
    private readonly baseUrl: string;
    private readonly clientId: string;

    constructor(config: {
        baseUrl: string;
        clientId: string;
    }) {
        this.baseUrl = config.baseUrl;
        this.client = new Client(config.baseUrl)
        this.homeService = new GraphqlHomeService(this.client, config.clientId)
        this.clientId = config.clientId;
    }
}

export default Platform;