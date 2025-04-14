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

    constructor(baseUrl: string, clientId: string) {
        this.baseUrl = baseUrl;
        this.client = new Client(baseUrl)
        this.homeService = new GraphqlHomeService(this.client, clientId)
        this.clientId = clientId;
    }
}

export default Platform;