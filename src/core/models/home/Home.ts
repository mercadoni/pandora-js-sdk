import HomeWidget
    from "./HomeWidget";
import Carrusel
    from "../Carousel";
import Category
    from "../catalog/Category";
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
    }

    static fromJson(json: Record<string, any>): Home {
        const widgets = Array.isArray(json.widgets)
            ? json.widgets.map((widgetData: any) => {
                if (widgetData.dataSource === 'CAROUSEL' && Array.isArray(widgetData.data?.items)) {
                    widgetData.data.items = widgetData.data.items.map((item: Record<string, any>) =>
                        Carrusel.fromJson(item)
                    );
                } else if (widgetData.dataSource === 'CATEGORY_AND_PRODUCTS' && Array.isArray(widgetData.data?.items)) {
                    widgetData.data.items = widgetData.data.items.map((item: Record<string, any>) =>
                        Category.fromJson(item)
                    );
                    console.log(widgetData.data);
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
                isDraft: json.isDraft
            });
        } else {
            throw new Error('Invalid home json: id, targetType, and storeReferences are required');
        }
    }
}

export default Home;

