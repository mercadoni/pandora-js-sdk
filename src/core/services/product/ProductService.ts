import Search from '../../models/catalog/Search';
import SearchFilter from './SearchFilter';
import Product from '../../models/catalog/Product';
import GetProductsBySKUFilter from './GetProductsBySKUFilter';
import GetSuggestedProductsFilter from './GetSuggestedProductsFilter';
import GetProductRecommendationsFilter from './GetProductRecommendationsFilter';

interface ProductService {

    search(filter: SearchFilter): Promise<Search>;

    getProductsBySKU(filter: GetProductsBySKUFilter): Promise<Product[]>;

    getSuggestedProducts(filter: GetSuggestedProductsFilter): Promise<Product[]>;

    getProductRecommendations(filter: GetProductRecommendationsFilter): Promise<Product[]>;

}

export default ProductService;
