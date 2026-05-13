import Product from './Product';
import Pagination from './Pagination';
import Aggregate from './Aggregate';
import Carousel from '../Carousel';

class Search {
    constructor(
        public readonly products: Product[],
        public readonly pagination: Pagination,
        public readonly aggregates: Aggregate[],
        public readonly carousels: Carousel[],
        public readonly promoted: any,
    ) {}

    static fromJson(json: Record<string, any>): Search {
        const products = Array.isArray(json.products)
            ? json.products.map((p: Record<string, any>) => Product.fromJson(p))
            : [];
        const pagination = json.pagination
            ? Pagination.fromJson(json.pagination)
            : new Pagination(0, 0, null);
        const aggregates = Array.isArray(json.aggregates)
            ? json.aggregates.map((a: Record<string, any>) => Aggregate.fromJson(a))
            : [];
        const carousels = Array.isArray(json.carousels)
            ? json.carousels.map((c: Record<string, any>) => Carousel.fromJson(c))
            : [];
        return new Search(products, pagination, aggregates, carousels, json.promoted ?? null);
    }
}

export default Search;
