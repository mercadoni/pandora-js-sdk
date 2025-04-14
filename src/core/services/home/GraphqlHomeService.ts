import Home from "../../models/home/Home";
import HomeFilter from "./HomeFilter";
import HomeService from "./HomeService";
import GraphqlClient from "../../http/GraphqlClient";
import getDynamicHomeQuery from "./GetDynamicHomeQuery";

class GraphqlHomeService implements HomeService {

    constructor(private readonly client: GraphqlClient, private readonly clientId: string) {
        this.client = client;
        this.clientId = clientId;
    }

    async home(filter: HomeFilter): Promise<Home> {
        filter.query['clientId'] = this.clientId;
        const variables = {
            "getDynamicHomeInput": filter.query,
        }
        const response = await this.client.query(getDynamicHomeQuery, variables)
        if (response.data?.getDynamicHome) {
            return Home.fromJson(response.data?.getDynamicHome);
        } else {
            throw Error(`Failed to fetch home. Filter : ${filter.query}, response : ${JSON.stringify(response)} `);
        }

    }
}

export default GraphqlHomeService;