import Input from '../../models/Input';

export type SearchQueryFieldsOption =
    | 'BRAND'
    | 'CATEGORIES_NAME'
    | 'NAME'
    | 'SEARCHKEYWORDS'
    | 'SKU'
    | 'TAGS_NAME'
    | 'TAG_REFERENCE';

class SearchFilter extends Input {
    constructor(config: {
        pageSize: number;
        currentPage: number;
        storeReference: string;
        search: Array<{
            query: string;
            fields?: Array<{ option: SearchQueryFieldsOption; weight?: number }>;
        }>;
        minScore?: number;
        filters?: Record<string, any>;
        sort?: { asc?: string[]; desc?: string[] };
        googleAnalyticsSessionId?: string;
    }) {
        super();
        this.query['pageSize'] = config.pageSize;
        this.query['currentPage'] = config.currentPage;
        this.query['storeReference'] = config.storeReference;
        this.query['search'] = config.search;
        if (config.minScore !== undefined) this.query['minScore'] = config.minScore;
        if (config.filters !== undefined) this.query['filters'] = config.filters;
        if (config.sort !== undefined) this.query['sort'] = config.sort;
        if (config.googleAnalyticsSessionId !== undefined) this.query['googleAnalyticsSessionId'] = config.googleAnalyticsSessionId;
    }
}

export default SearchFilter;
