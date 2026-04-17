import Product
    from "./Product";
import Pagination
    from "./Pagination";
import Aggregate
    from "./Aggregate";

class Category {

    categoryReference: string;
    categoriesPath: string;
    level: number;
    hasChildren: boolean;
    name: string;
    active: boolean;
    boost: number;
    isAvailableInHome: boolean;
    slug: string;
    pagination: Pagination;
    products: Array<Product>;
    aggregates: Array<Aggregate>;
    subCategories: Array<Category>;
    categoryNamesPath: string;
    imageUrl: string;
    shortName: string;
    isFeatured: boolean;

    constructor(config: {
        categoryReference: string;
        categoriesPath: string,
        level: number,
        hasChildren: boolean,
        name: string,
        active: boolean,
        boost: number,
        isAvailableInHome: boolean,
        slug: string,
        pagination: Pagination,
        products: Array<Product>,
        aggregates: Array<Aggregate>,
        subCategories: Array<Category>,
        categoryNamesPath: string,
        imageUrl: string,
        shortName: string,
        isFeatured: boolean,
    }) {
        this.categoryReference = config.categoryReference;
        this.categoriesPath = config.categoriesPath;
        this.level = config.level;
        this.hasChildren = config.hasChildren;
        this.slug = config.slug;
        this.name = config.name;
        this.active = config.active;
        this.boost = config.boost;
        this.isAvailableInHome = config.isAvailableInHome;
        this.pagination = new Pagination();
        this.products = config.products;
        this.aggregates = [];
        this.subCategories = [];
        this.categoryNamesPath = config.categoryNamesPath;
        this.imageUrl = config.imageUrl;
        this.shortName = config.shortName;
        this.isFeatured = config.isFeatured;
    }


    static fromJson(json: Record<string, any>): Category {
        return new Category({
            categoryReference: json.categoryReference || '',
            categoriesPath: json.categoriesPath || '',
            level: json.level || 0,
            hasChildren: json.hasChildren,
            slug: json.slug || '',
            name: json.name || '',
            active: json.active || false,
            boost: json.boost || 0,
            isAvailableInHome: json.isAvailableInHome || false,
            pagination: new Pagination(),
            products:
                Array.isArray(json.products) ? json.products.map(product => Product.fromJson(product))
                    .filter(product => product !== null) : [],
            aggregates: [],
            subCategories: [],
            categoryNamesPath: json.categoryNamesPath || '',
            imageUrl: json.imageUrl || '',
            shortName: json.shortName || '',
            isFeatured: json.isFeatured || false,
        })
    }
}

export default Category;