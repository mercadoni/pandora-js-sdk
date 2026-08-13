import Search from '../../models/catalog/Search';
import CategorySearch from '../../models/catalog/CategorySearch';
import SearchFilter from './SearchFilter';
import Product from '../../models/catalog/Product';
import GetProductsBySKUFilter from './GetProductsBySKUFilter';
import GetProductsByCategoryFilter from './GetProductsByCategoryFilter';
import GetSuggestedProductsFilter from './GetSuggestedProductsFilter';
import GetProductRecommendationsFilter from './GetProductRecommendationsFilter';

interface ProductService {

    search(filter: SearchFilter): Promise<Search>;

    getProductsByCategory(filter: GetProductsByCategoryFilter): Promise<CategorySearch>;

    getProductsBySKU(filter: GetProductsBySKUFilter): Promise<Product[]>;

    getSuggestedProducts(filter: GetSuggestedProductsFilter): Promise<Product[]>;

    getProductRecommendations(filter: GetProductRecommendationsFilter): Promise<Product[]>;

}

export default ProductService;
