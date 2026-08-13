import Input from '../../models/Input';

class GetProductsByCategoryFilter extends Input {
    constructor(config: {
        categoryReference: string;
        storeReference: string;
        pageSize: number;
        currentPage: number;
        categoryId?: string;
        filters?: Record<string, any>;
        sort?: { asc?: string[]; desc?: string[] };
        googleAnalyticsSessionId?: string;
    }) {
        super();
        this.query['categoryReference'] = config.categoryReference;
        this.query['storeReference'] = config.storeReference;
        this.query['pageSize'] = config.pageSize;
        this.query['currentPage'] = config.currentPage;
        if (config.categoryId !== undefined) this.query['categoryId'] = config.categoryId;
        if (config.filters !== undefined) this.query['filters'] = config.filters;
        if (config.sort !== undefined) this.query['sort'] = config.sort;
        if (config.googleAnalyticsSessionId !== undefined) this.query['googleAnalyticsSessionId'] = config.googleAnalyticsSessionId;
    }
}

export default GetProductsByCategoryFilter;
