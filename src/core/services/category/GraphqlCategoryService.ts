import CategoryService from './CategoryService';
import GetCategoryTreeFilter from './GetCategoryTreeFilter';
import Category from '../../models/catalog/Category';
import getCategoryTreeQuery from './queries/GetCategoryTreeQuery';
import IGraphqlClient from '../../http/GraphqlClient';

class GraphqlCategoryService implements CategoryService {

    constructor(private readonly client: IGraphqlClient, private readonly clientId: string) {
        this.client = client;
        this.clientId = clientId;
    }

    async getCategoryTree(filter: GetCategoryTreeFilter): Promise<Category[]> {
        filter.query['clientId'] = this.clientId;
        const response = await this.client.query(getCategoryTreeQuery, {
            getCategoryInput: filter.query,
        });
        if (Array.isArray(response.data?.getCategory)) {
            return response.data.getCategory.map((node: Record<string, any>) => Category.fromJson(node));
        }
        throw new Error(`getCategoryTree failed: ${JSON.stringify(response.errors || response)}`);
    }
}

export default GraphqlCategoryService;
