import ProductService from "./ProductService";
import SearchFilter from "../../models/SearchFilter";
import Search from "../../models/Search";

import IGraphqlClient from "../../http/GraphqlClient";

class RemoteProductService implements ProductService {

    constructor(private readonly client: IGraphqlClient) {
        this.client = client
    }

    async search(filter: SearchFilter): Promise<Search> {
        throw new Error("Method not implemented.");
    }
}