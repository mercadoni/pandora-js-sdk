import HomeWidget
    from "./HomeWidget";
import Style from "./Style";
import MetaData
    from "./MetaData";
import WidgetData
    from "./WidgetData";

class Home {
    widgets: Array<HomeWidget>;
    id: string;
    screenSize: string;
    platform: string;
    store: string;
    isDefault: boolean;
    isActive: boolean;
    isDraft: boolean;
    name: string;

    constructor(config: {
        widgets?: Array<HomeWidget>;
        id?: string;
        screenSize?: string;
        platform?: string;
        store?: string;
        isDefault?: boolean;
        isActive?: boolean;
        isDraft?: boolean;
        name?: string;
    }) {
        this.widgets = config.widgets || [];
        this.id = config.id || '';
        this.screenSize = config.screenSize || '';
        this.platform = config.platform || '';
        this.store = config.store || '';
        this.isDefault = config.isDefault || false;
        this.isActive = config.isActive || false;
        this.isDraft = config.isDraft || false;
        this.name = config.name || '';
    }

    static fromJson(jsonObject: Record<string, any>): Home {

        if (jsonObject.widgets && Array.isArray(jsonObject.widgets)) {
            jsonObject.widgets.map((widgetData: any) => {
                console.log(widgetData.metaData)
                return new HomeWidget({
                    type: widgetData.type || '',
                    dataSource: widgetData.dataSource || '',
                    style: Style.fromJson(widgetData.style || {}),
                    metaData: MetaData.fromJson(widgetData.metaData || {}),
                    data: WidgetData.fromJson(widgetData.data || {})
                });
            });
        }

        return new Home({
            widgets: jsonObject.widgets || [],
            id: jsonObject.id || '',
            screenSize: jsonObject.breakpointId || '',
            platform: jsonObject.targetType || '',
            store: jsonObject.store || '',
            isDefault: jsonObject.isDefault || false,
            name: jsonObject.name || '',
            isActive: jsonObject.isActive || false,
            isDraft: jsonObject.isDraft || false
        });
    }
}

export default Home;