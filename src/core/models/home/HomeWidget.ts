import WidgetData
    from "./WidgetData";
import MetaData
    from "./MetaData";
import Style from "./Style";

class HomeWidget {
    type: string
    dataSource: string
    style: Style
    metaData: MetaData
    data: WidgetData

    constructor(config: {
        type?: string,
        dataSource?: string,
        style?: Style,
        metaData?: MetaData,
        data?: WidgetData
    }) {
        this.type = config.type || '';
        this.dataSource = config.dataSource || '';
        this.style = config.style || new Style({});
        this.metaData = config.metaData || {};
        this.data = config.data || {};
    }

    static fromJson(json: Record<string, any>): HomeWidget {

        return new HomeWidget({
            type: json.type,
            dataSource: json.dataSource,
            style: Style.fromJson(json.style),
            metaData: json.metaData,
            data: json.data,
        })
    }
}

export default HomeWidget;

