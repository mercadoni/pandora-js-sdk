import Category from './Category';
import Pagination from './Pagination';
import Aggregate from './Aggregate';
import Carousel from '../Carousel';

class CategorySearch {
    constructor(
        public readonly category: Category,
        public readonly pagination: Pagination,
        public readonly aggregates: Aggregate[],
        public readonly carousels: Carousel[],
        public readonly promoted: any,
    ) {}

    static fromJson(json: Record<string, any>): CategorySearch {
        const category = json.category
            ? Category.fromJson(json.category)
            : Category.fromJson({});
        const pagination = json.pagination
            ? Pagination.fromJson(json.pagination)
            : new Pagination(0, 0, null);
        const aggregates = Array.isArray(json.aggregates)
            ? json.aggregates.map((a: Record<string, any>) => Aggregate.fromJson(a))
            : [];
        const carousels = Array.isArray(json.carousels)
            ? json.carousels.map((c: Record<string, any>) => Carousel.fromJson(c))
            : [];
        return new CategorySearch(category, pagination, aggregates, carousels, json.promoted ?? null);
    }
}

export default CategorySearch;
