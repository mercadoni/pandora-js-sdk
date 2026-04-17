import Carousel from "../Carousel";
import Category from "../catalog/Category";
import Product from "../catalog/Product";

class WidgetData {
    products: Array<Product> = [];
    categories: Array<Category> = [];
    carousels: Array<Carousel> = [];
    link?: { url: string; text: string };
    src?: string;
    content?: string;

    constructor(config: {
        products?: Array<Product>;
        categories?: Array<Category>;
        carousels?: Array<Carousel>;
        link?: { url: string; text: string };
        src?: string;
        content?: string;
    }) {
        this.products = config.products ?? [];
        this.categories = config.categories ?? [];
        this.carousels = config.carousels ?? [];
        this.link = config.link;
        this.src = config.src;
        this.content = config.content;
    }

    static fromJson(json: Record<string, any>): WidgetData {
        return new WidgetData({});
    }
}

export default WidgetData;
