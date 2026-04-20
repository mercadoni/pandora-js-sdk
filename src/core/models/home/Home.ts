import HomeWidget
    from "./HomeWidget";
import Carrusel
    from "../Carousel";
import Category
    from "../catalog/Category";
import Product
    from "../catalog/Product";
import isValid
    from "../../utils/utils";

class Home {
    widgets: Array<HomeWidget>;
    id: string;
    screenSize: string;
    platform: string;
    stores: Array<string>;
    isDefault: boolean;
    isActive: boolean;
    isDraft: boolean;
    name: string;
    uiConfig: Record<string, any>;

    constructor(config: {
        widgets: Array<HomeWidget>;
        id: string;
        screenSize: string;
        platform: string;
        stores: Array<string>;
        isDefault?: boolean;
        isActive?: boolean;
        isDraft?: boolean;
        name?: string;
        uiConfig?: Record<string, any>;
    }) {
        this.widgets = config.widgets;
        this.id = config.id;
        this.screenSize = config.screenSize;
        this.platform = config.platform;
        this.stores = config.stores;
        this.isDefault = config.isDefault || false;
        this.isActive = config.isActive || false;
        this.isDraft = config.isDraft || false;
        this.name = config.name || '';
        this.uiConfig = config.uiConfig ?? {};
    }

    static fromJson(json: Record<string, any>): Home {
        const widgets = Array.isArray(json.widgets)
            ? json.widgets.map((widgetData: any) => {
                if (widgetData.dataSource === 'CAROUSEL' && Array.isArray(widgetData.data?.items)) {
                    widgetData.data.carousels = widgetData.data.items.map((item: Record<string, any>) =>
                        Carrusel.fromJson(item)
                    );
                } else if (widgetData.dataSource === 'CATEGORY_AND_PRODUCTS' && Array.isArray(widgetData.data?.categories)) {
                    widgetData.data.categories = widgetData.data.categories.map((item: Record<string, any>) =>
                        Category.fromJson(item)
                    );
                } else if (widgetData.dataSource === 'FEATURED_CATEGORIES' && Array.isArray(widgetData.data?.categories)) {
                    widgetData.data.categories = widgetData.data.categories.map((item: Record<string, any>) =>
                        Category.fromJson(item)
                    );
                } else if (
                    (widgetData.dataSource === 'SPONSORED_HOME' ||
                     widgetData.dataSource === 'TRENDING_PRODUCTS' ||
                     widgetData.dataSource === 'RECOMMENDED_FOR_YOU') &&
                    Array.isArray(widgetData.data?.items)
                ) {
                    widgetData.data.products = widgetData.data.items.map((item: Record<string, any>) =>
                        Product.fromJson(item)
                    );
                } else if (
                    widgetData.dataSource === 'MANUAL_SOURCE' ||
                    widgetData.dataSource === 'MANUAL_BOX' ||
                    widgetData.dataSource === 'MANUAL_ADS_BANNERS'
                ) {
                    // passed through as-is
                } else {
                    return null;
                }
                return widgetData;
            })
            : [];

        if (isValid(json.id) && isValid(json.breakpoint) && isValid(json.targetType) &&
            Array.isArray(json.storeReferences) && json.storeReferences.length > 0) {
            return new Home({
                widgets: widgets.filter(item => item !== null),
                id: json.id,
                screenSize: json.breakpoint,
                platform: json.targetType,
                stores: json.storeReferences,
                isDefault: json.isDefault,
                name: json.name,
                isActive: json.isActive,
                isDraft: json.isDraft,
                uiConfig: json.uiConfig ?? {},
            });
        } else {
            throw new Error('Invalid home json: id, targetType, and storeReferences are required');
        }
    }
}

export default Home;
