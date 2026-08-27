import Category from '../../models/catalog/Category';
import GetCategoryTreeFilter from './GetCategoryTreeFilter';

interface CategoryService {
    getCategoryTree(filter: GetCategoryTreeFilter): Promise<Category[]>;
}

export default CategoryService;
